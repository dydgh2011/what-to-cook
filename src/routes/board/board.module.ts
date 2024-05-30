import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { ImageEntity } from 'src/entities/image.entity';
import { UserService } from '../user/user.service';
import { FriendRequestEntity } from 'src/entities/friends-request.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationEntity } from 'src/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      UserEntity,
      CommentEntity,
      ImageEntity,
      FriendRequestEntity,
      NotificationEntity,
    ]),
  ],
  controllers: [BoardController],
  providers: [BoardService, UserService, NotificationService],
})
export class BoardModule {}
