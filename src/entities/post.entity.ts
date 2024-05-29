import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'post' })
export class PostEntity {
  @ApiProperty({
    description: 'The unique identifier for the post',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the post',
    example: 'A Day in the Life',
  })
  @Column({
    type: 'varchar',
    name: 'title',
    length: 50,
    nullable: false,
    default: 'Untitled',
    select: true,
  })
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'Today, I went to the park...',
  })
  @Column({
    type: 'varchar',
    name: 'content',
    length: 2000,
    nullable: false,
    default: 'No content',
    select: false,
  })
  content: string;

  @ApiProperty({
    description: 'A brief description of the post',
    example: 'A short summary of my day',
  })
  @Column({
    type: 'varchar',
    name: 'description',
    length: 100,
    default: '',
    nullable: false,
    select: true,
  })
  description: string;

  @ApiProperty({
    description: 'The URL of the thumbnail image for the post',
    example: 'thumbnail.jpg',
  })
  @Column({
    type: 'varchar',
    name: 'thumbnail',
    nullable: false,
    select: true,
  })
  thumbnail: string;

  @ApiProperty({
    description: 'The date and time when the post was created',
    example: '2023-05-29T12:34:56Z',
  })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    select: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the post was last updated',
    example: '2023-06-01T08:21:45Z',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    select: true,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The number of likes the post has received',
    example: 123,
  })
  @Column({
    type: 'int4',
    name: 'likes',
    nullable: false,
    default: 0,
    select: true,
  })
  likes: number;

  // @ApiHideProperty()
  // @OneToMany(() => ImageEntity, (image) => image.post, {
  //   cascade: true,
  // })
  // images: ImageEntity[];

  @ApiProperty({
    description: 'The comments associated with the post',
    type: () => CommentEntity,
    isArray: true,
  })
  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  comments: CommentEntity[];

  @ApiProperty({
    description: 'The user who created the post',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'userId',
  })
  user: UserEntity;
}
