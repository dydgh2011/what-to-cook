import { CommentEntity } from 'src/entities/comment.entity';
import { FriendRequestEntity } from 'src/entities/friends-request.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';

export class ClientGetUserResDTO {
  id: string;
  username: string;
  email: string;
  tastes: string;
  profilePicture: string;
  coverPicture: string;
  posts: PostEntity[];
  comments: CommentEntity[];
  likedPosts: PostEntity[];
  friends: UserEntity[];
  sentFriendRequests: FriendRequestEntity[];
  receivedFriendRequests: FriendRequestEntity[];
  notifications: NotificationEntity[];
}
