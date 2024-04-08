import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from 'src/routes/user/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  // FIXME: change this to use enum to get select columns
  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'password', 'email', 'role'],
    });
    return user;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'email', 'role'],
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'password', 'email', 'role'],
    });
    return user;
  }

  async createUser(data: CreateUserDto) {
    const { username, password, email } = data;
    const encryptedPassword = await hash(password, 10);

    return await this.userRepository.save({
      username: username,
      password: encryptedPassword,
      email: email,
    });
  }
}
