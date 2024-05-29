import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { FriendRequestEntity } from 'src/entities/friends-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FriendRequestEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
