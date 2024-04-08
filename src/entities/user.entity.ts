import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { CommentEntity } from './comment.entity';
import { UserRole } from './data-types-for-entities';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: 'user' })
export class UserEntity {
  /**
   * Unique identifier for the user
   * @example 1
   */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /**
   * Username for the user
   * @example johnDoe
   * @default None
   */
  @Column({ type: 'varchar', unique: true, length: 50 })
  username: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', unique: true, length: 254 })
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshToken: RefreshTokenEntity;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => UserEntity, (user) => user.friends)
  friends: UserEntity[];

  @OneToMany(() => UserEntity, (user) => user.friendsRequestsSent)
  friendsRequestsSent: UserEntity[];

  @OneToMany(() => UserEntity, (user) => user.friendsRequestsReceived)
  friendsRequestsReceived: UserEntity[];

  @Column({ type: 'varchar', nullable: true })
  tastes?: string;

  @Column({ type: 'varchar', nullable: true })
  profilePicture?: string;

  @Column({ type: 'varchar', nullable: true })
  coverPicture?: string;
}
