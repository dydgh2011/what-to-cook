import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'friend_request' })
export class FriendRequestEntity {
  @ApiProperty({
    description: 'The unique identifier for the friend request',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'The user who sent the friend request',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.sentFriendRequests, {
    onDelete: 'CASCADE',
  })
  sender: UserEntity;

  @ApiProperty({
    description: 'The user who received the friend request',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.receivedFriendRequests, {
    onDelete: 'CASCADE',
  })
  recipient: UserEntity;
}
