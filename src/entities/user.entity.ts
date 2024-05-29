import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { CommentEntity } from './comment.entity';
import { UserRole, VerificationMethod } from './data-types-for-entities';
import { FriendRequestEntity } from './friends-request.entity';
import { NotificationEntity } from './notification.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user' })
@Unique(['verificationMethod', 'verificationValue'])
export class UserEntity {
  @ApiProperty({
    description: 'The unique identifier for the user',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @Column({
    type: 'varchar',
    length: 50,
    select: false,
    nullable: false,
    default: 'NoName',
    unique: false,
  })
  username: string;

  @ApiProperty({
    description: 'The verification method used by the user',
    enum: VerificationMethod,
    enumName: 'VerificationMethod',
    default: VerificationMethod.LOCAL,
  })
  @Column({
    type: 'enum',
    enum: VerificationMethod,
    default: VerificationMethod.LOCAL,
    update: false,
    select: false,
  })
  verificationMethod: VerificationMethod;

  @ApiProperty({
    description: 'The value used for verification',
    example: 'abc123',
  })
  @Column({
    nullable: false,
    update: false,
    select: false,
  })
  verificationValue: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@example.com',
  })
  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
    update: false,
    select: false,
  })
  email: string;

  @ApiProperty({
    description: 'The hashed password of the user',
    example: '$2b$10$Nc.sRi/k4bYt5g2/.aS.KeIiC0j7lgBHcXGZDkVQ5ydFp4vcA40TG',
  })
  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
  })
  password: string;

  @ApiProperty({
    description: 'The version of the access token',
    example: 0,
  })
  @Column({
    type: 'int2',
    nullable: false,
    select: false,
    default: 0,
  })
  accessTokenVersion: number;

  @ApiProperty({
    description: 'The version of the refresh token',
    example: 0,
  })
  @Column({
    type: 'int2',
    nullable: false,
    select: false,
    default: 0,
  })
  refreshTokenVersion: number;

  @ApiProperty({
    description: "Indicates if the user's email is confirmed",
    example: false,
  })
  @Column({
    type: 'boolean',
    default: false,
    select: false,
  })
  emailConfirmed: boolean;

  @ApiProperty({
    description: 'The token used for email verification',
    example: 'zDHRCTWneA',
  })
  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
  })
  emailVerificationToken: string;

  @ApiProperty({
    description: 'The token used for password reset',
    example: 'zDHRCTWneA',
  })
  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
  })
  passwordResetToken: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    enumName: 'UserRole',
    default: UserRole.USER,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role',
    default: UserRole.USER,
    select: false,
    update: false,
  })
  role: UserRole;

  @ApiProperty({
    description: 'The date and time when the user account was created',
    example: '2023-05-29T12:34:56Z',
  })
  @CreateDateColumn({
    name: 'created_at',
    select: false,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The tastes/preferences of the user',
    example: 'Music, Travel',
  })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    select: false,
    default: '',
  })
  tastes?: string;

  @ApiProperty({
    description: 'The URL of the profile picture of the user',
    example: 'profile.jpg',
  })
  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
    default: 'default-user-profile.png',
  })
  profilePicture?: string;

  @ApiProperty({
    description: 'The URL of the cover picture of the user',
    example: 'cover.jpg',
  })
  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
    default: 'default-cover-picture.png',
  })
  coverPicture?: string;

  @ApiProperty({
    description: 'The notifications associated with the user',
    type: () => NotificationEntity,
    isArray: true,
  })
  @OneToMany(() => NotificationEntity, (notification) => notification.user, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  notifications: NotificationEntity[];

  @ApiProperty({
    description: 'The posts created by the user',
    type: () => PostEntity,
    isArray: true,
  })
  @OneToMany(() => PostEntity, (post) => post.user, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  posts: PostEntity[];

  @ApiProperty({
    description: 'The comments made by the user',
    type: () => CommentEntity,
    isArray: true,
  })
  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  comments: CommentEntity[];

  @ApiProperty({
    description: 'The posts liked by the user',
    type: () => PostEntity,
    isArray: true,
  })
  @ManyToMany(() => PostEntity, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @JoinTable()
  likedPosts: PostEntity[];

  @ApiProperty({
    description: 'The friends of the user',
    type: () => UserEntity,
    isArray: true,
  })
  @ManyToMany(() => UserEntity, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @JoinTable()
  friends: UserEntity[];

  @ApiProperty({
    description: 'The friend requests sent by the user',
    type: () => FriendRequestEntity,
    isArray: true,
  })
  @OneToMany(() => FriendRequestEntity, (request) => request.sender, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  sentFriendRequests: FriendRequestEntity[];

  @ApiProperty({
    description: 'The friend requests received by the user',
    type: () => FriendRequestEntity,
    isArray: true,
  })
  @OneToMany(() => FriendRequestEntity, (request) => request.recipient, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  receivedFriendRequests: FriendRequestEntity[];
}
