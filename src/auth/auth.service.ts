import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from 'src/routes/user/user.service';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/routes/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.getUserByUsername(username);

    if (user) {
      const match = await compare(password, user.password);
      if (match) return user;
    }

    return null;
  }

  async logIn(user: UserEntity) {
    const accessToken = await this.generateToken(user);

    // const refreshToken = await this.generateRefreshToken(user);
    // await this.createRefreshTokenByUser(user.id, refreshToken);

    return {
      accessToken: accessToken,
      // refreshToken: refreshToken,
    };
  }

  async signUp(userInfo: CreateUserDto) {
    let user = await this.userService.getUserByUsername(userInfo.username);
    if (user) {
      throw new HttpException('User already exists', 400);
    } else {
      user = await this.userService.getUserByEmail(userInfo.email);
      if (user) {
        throw new HttpException('User already exists', 400);
      }
    }
    return await this.userService.createUser(userInfo);
  }

  async generateToken(user: UserEntity): Promise<string> {
    return await this.jwtService.signAsync({
      username: user.username,
      sub: user.id,
    });
  }

  async generateRefreshToken(user: UserEntity): Promise<string> {
    return this.jwtService.signAsync({
      username: user.username,
      sub: user.id,
      type: 'refresh',
    });
  }

  async createRefreshTokenByUser(userId: number, refreshToken: string) {
    let refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      user: { id: userId },
    });
    if (refreshTokenEntity) {
      refreshTokenEntity.token = refreshToken;
    } else {
      refreshTokenEntity = this.refreshTokenRepository.create({
        user: { id: userId },
        token: refreshToken,
      });
    }

    await this.refreshTokenRepository.save(refreshTokenEntity);
  }

  async checkSecurityLevel(
    payload: { userId: number; username: string },
    role: string,
  ) {
    const user = await this.userService.getUserById(payload.userId);
    if (!user) {
      return false;
    }
    if (user.role === role) {
      return true;
    } else {
      return false;
    }
  }
}
