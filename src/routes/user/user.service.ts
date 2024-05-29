import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { FriendRequestEntity } from 'src/entities/friends-request.entity';
import {
  CreateUserReqDto,
  GetUserByIdReqDTO,
  GetUserReqDTO,
  UpdateUserByIdReqDTO,
  UpdateUserRelationByIdReqDTO,
  UpdateUserReqDTO,
} from './dto/req.dto';
import { VerificationMethod } from 'src/entities/data-types-for-entities';
import { isValidUUID } from '../common/methods';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(FriendRequestEntity)
    private friendRequestRepository: Repository<FriendRequestEntity>,
  ) {}

  async createUser(data: CreateUserReqDto): Promise<UserEntity> {
    const { verificationMethod, verificationValue } = data;
    let user = undefined;
    switch (verificationMethod) {
      case VerificationMethod.LOCAL:
        user = await this.getUser({
          verificationMethod,
          verificationValue,
        });
        if (user) {
          throw new BadRequestException('User with same ID already exists');
        } else {
          const encryptedPassword = await hash(
            data.password,
            parseInt(process.env.SALT_ROUNDS, 10),
          );
          return await this.userRepository.save({
            verificationMethod: verificationMethod,
            username: data.username,
            verificationValue,
            password: encryptedPassword,
            email: data.email,
          });
        }
      case VerificationMethod.GOOGLE:
      case VerificationMethod.FACEBOOK:
      case VerificationMethod.TWITTER:
        user = await this.getUser({
          verificationMethod,
          verificationValue,
        });
        if (user) {
          throw new BadRequestException('User with same ID already exists');
        } else {
          user = await this.userRepository.save({
            verificationMethod: verificationMethod,
            username: data.username,
            verificationValue,
            emailConfirmed: true,
          });
          await this.updateUserById({
            id: user.id,
            column: 'emailConfirmed',
            value: 'true',
          });
          return user;
        }
      default:
        throw new BadRequestException('Invalid verification method');
    }
  }

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getUser(data: GetUserReqDTO): Promise<UserEntity> {
    const { verificationMethod, verificationValue, userFields, relations } =
      data;
    return await this.userRepository.findOne({
      where: { verificationMethod, verificationValue },
      select: ['id', ...(userFields || [])],
      relations: [...(relations || [])],
    });
  }

  async getUserById(data: GetUserByIdReqDTO): Promise<UserEntity> {
    const { id, userFields, relations } = data;
    if (!isValidUUID(id)) {
      throw new BadRequestException('invalid uuid');
    }
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', ...(userFields || [])],
      relations: [...(relations || [])],
    });
  }

  async updateUser(data: UpdateUserReqDTO): Promise<void> {
    const { verificationMethod, verificationValue, column, value } = data;
    const user = await this.getUser({
      verificationMethod,
      verificationValue,
      userFields: [
        'username',
        'email',
        'password',
        'accessTokenVersion',
        'refreshTokenVersion',
        'emailConfirmed',
        'tastes',
        'profilePicture',
        'coverPicture',
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    switch (column) {
      case 'username':
      case 'email':
      case 'password':
      case 'tastes':
      case 'profilePicture':
      case 'coverPicture':
        user[column] = String(value);
        break;
      case 'accessTokenVersion':
      case 'refreshTokenVersion':
        user[column] = Number(value);
        break;
      case 'emailConfirmed':
        const emailConfirmed = value === 'true' ? true : false;
        user[column] = emailConfirmed;
        break;
    }
    await this.userRepository.save(user);
    return;
  }

  async updateUserById(data: UpdateUserByIdReqDTO): Promise<void> {
    const { id, column, value } = data;
    const user = await this.getUserById({
      id,
      userFields: [
        'username',
        'verificationMethod',
        'verificationValue',
        'email',
        'password',
        'accessTokenVersion',
        'refreshTokenVersion',
        'emailConfirmed',
        'emailVerificationToken',
        'passwordResetToken',
        'role',
        'createdAt',
        'tastes',
        'profilePicture',
        'coverPicture',
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    switch (column) {
      case 'username':
      case 'email':
      case 'password':
      case 'tastes':
      case 'profilePicture':
      case 'coverPicture':
      case 'emailVerificationToken':
      case 'passwordResetToken':
        user[column] = String(value);
        break;
      case 'accessTokenVersion':
      case 'refreshTokenVersion':
        user[column] = Number(value);
        break;
      case 'emailConfirmed':
        const emailConfirmed = value === 'true' ? true : false;
        user[column] = emailConfirmed;
        break;
    }
    await this.userRepository.save(user);
    return;
  }

  async updateUserRelationById(
    data: UpdateUserRelationByIdReqDTO,
  ): Promise<void> {
    const { id, relation, add, value } = data;
    const user = await this.getUserById({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    switch (relation) {
      case 'likedPosts':
        if (add) {
          await this.userRepository
            .createQueryBuilder()
            .relation(UserEntity, 'likedPosts')
            .of(id)
            .add(value);
        } else {
          await this.userRepository
            .createQueryBuilder()
            .relation(UserEntity, 'likedPosts')
            .of(id)
            .remove(value);
        }
        break;
      default:
        throw new BadRequestException('Invalid relation');
    }
    return;
  }

  async updateUserWhole(
    username: string,
    tastes: string,
    profilePicture: string,
    coverPicture: string,
    userId: string,
  ): Promise<void> {
    const user = await this.getUserById({
      id: userId,
      userFields: ['username', 'tastes', 'profilePicture', 'coverPicture'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.username = username;
    user.tastes = tastes;
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }
    if (coverPicture) {
      user.coverPicture = coverPicture;
    }
    await this.userRepository.save(user);
    return;
  }

  async deleteUser(user: UserEntity): Promise<void> {
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userRepository.delete(user.id);
    return;
  }

  async getProfilePicture(id: string): Promise<string> {
    const user = await this.getUserById({
      id,
      userFields: ['profilePicture'],
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.profilePicture;
  }

  async getCoverPicture(id: string): Promise<string> {
    const user = await this.getUserById({
      id,
      userFields: ['coverPicture'],
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.coverPicture;
  }
}
