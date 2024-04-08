import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CommentEntity } from 'src/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, CommentEntity])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
