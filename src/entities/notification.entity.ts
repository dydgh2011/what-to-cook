import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'notification' })
export class NotificationEntity {
  @ApiProperty({
    description: 'The unique identifier for the notification',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the notification',
    example: 'New Comment on Your Post',
  })
  @Column({
    type: 'varchar',
    nullable: false,
    default: 'No content',
    select: true,
  })
  title: string;

  @ApiProperty({
    description: 'The content of the notification',
    example: 'Someone has commented on your post.',
  })
  @Column({
    type: 'varchar',
    nullable: false,
    default: 'No content',
    select: true,
  })
  content: string;

  @ApiProperty({
    description: 'The URL of the image associated with the notification',
    example: 'image.png',
  })
  @Column({
    type: 'varchar',
    name: 'image',
    nullable: false,
    select: true,
  })
  image: string;

  @ApiProperty({
    description: 'The date and time when the notification was created',
    example: '2023-05-29T12:34:56Z',
  })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    select: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The user associated with the notification',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.notifications)
  @JoinColumn({
    name: 'userId',
  })
  user: UserEntity;
}
