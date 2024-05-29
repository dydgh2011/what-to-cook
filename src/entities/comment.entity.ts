import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'comment' })
export class CommentEntity {
  @ApiProperty({
    description: 'The unique identifier for the comment',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a comment.',
  })
  @Column({
    type: 'varchar',
    name: 'content',
    length: 200,
    nullable: false,
    default: 'No content',
    select: true,
  })
  content: string;

  @ApiProperty({
    description: 'The date and time when the comment was created',
    example: '2023-05-29T12:34:56Z',
  })
  @CreateDateColumn({
    name: 'created_at',
    select: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The post associated with the comment',
    type: () => PostEntity,
  })
  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'postId',
  })
  post: PostEntity;

  @ApiProperty({
    description: 'The user who made the comment',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'userId',
  })
  user: UserEntity;
}
