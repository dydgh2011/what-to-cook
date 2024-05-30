import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { UserService } from '../user/user.service';
import { CommentEntity } from 'src/entities/comment.entity';
import { CreatePostDto, UpdatePostDto } from './dto/req.dto';
import { UserEntity } from 'src/entities/user.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class BoardService {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async getPosts(page: number, limit: number, userId?: string) {
    if (userId) {
      //check if user exists
      const user = await this.userService.getUserById({
        id: userId,
        userFields: [],
      });
      if (!user) {
        throw new HttpException('no user found', 402);
      }
    }

    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    if (userId) {
      query.where('user.id = :userId', { userId });
    }
    const posts = await query.getMany();
    return posts;
  }

  async getPost(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      select: [
        'id',
        'title',
        'content',
        'description',
        'thumbnail',
        'createdAt',
        'updatedAt',
        'likes',
      ],
      relations: ['user'],
    });

    if (!post) {
      return null;
    }

    const comments = await this.commentRepository.find({
      where: { post: { id } },
      relations: ['user'],
    });
    post.comments = comments;

    return post;
  }

  async updatePostColumn(data: {
    id: string;
    column: string;
    value: number | string;
  }) {
    const { id, column, value } = data;
    const post = await this.getPost(id);
    if (!post) {
      throw new HttpException('no post', 402);
    }
    switch (column) {
      case 'title':
      case 'content':
      case 'description':
      case 'thumbnail':
        post[column] = String(value);
        break;
      case 'likes':
        post[column] = Number(value);
        break;
    }
    return await this.postRepository.save(post);
  }

  async createPost(data: CreatePostDto, user: UserEntity, thumbnail: string) {
    const { title, description, content } = data;
    return await this.postRepository.save({
      title,
      description,
      content,
      thumbnail,
      user,
    });
  }

  async updatePost(data: UpdatePostDto, user: UserEntity, thumbnail: string) {
    const { id, title, description, content } = data;

    const post = await this.getPost(id);

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.user.id !== user.id) {
      throw new Error('You do not have permission to update this post');
    }

    post.title = title;
    post.description = description;
    post.content = content;
    if (thumbnail) {
      post.thumbnail = thumbnail;
    }

    return await this.postRepository.save(post);
  }

  async deletePost(id: string, user: UserEntity) {
    const post = await this.getPost(id);

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.user.id !== user.id) {
      throw new Error('You do not have permission to delete this post');
    }

    await this.postRepository.remove(post);
  }

  async addComment(userId: string, postId: string, content: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new Error('Post not found');
    }

    const user = await this.userService.getUserById({
      id: userId,
      userFields: [],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const comment = await this.commentRepository.save({
      content,
      post,
      user,
    });

    return comment;
  }

  async checkIsLiked(postId: string, userId: string) {
    const post = await this.getPost(postId);
    const user = await this.userService.getUserById({
      id: userId,
      relations: ['likedPosts'],
    });

    if (!post || !user) {
      throw new HttpException('Post or User not found.', 402);
    }

    if (user.likedPosts.some((likedPost) => likedPost.id === postId)) {
      return true;
    } else {
      return false;
    }
  }

  async like(postId: string, userId: string) {
    const post = await this.getPost(postId);
    const user = await this.userService.getUserById({
      id: userId,
      relations: ['likedPosts'],
    });

    if (!post || !user) {
      throw new HttpException('Post or User not found.', 402);
    }

    if (!user.likedPosts.some((likedPost) => likedPost.id === postId)) {
      await this.updatePostColumn({
        id: postId,
        column: 'likes',
        value: ++post.likes,
      });
      return await this.userService.updateUserRelationById({
        id: user.id,
        relation: 'likedPosts',
        add: true,
        value: postId,
      });
    }
  }

  async dislike(postId: string, userId: string) {
    const post = await this.getPost(postId);
    const user = await this.userService.getUserById({
      id: userId,
      relations: ['likedPosts'],
    });

    if (!post || !user) {
      throw new HttpException('Post or User not found.', 402);
    }

    if (user.likedPosts.some((likedPost) => likedPost.id === postId)) {
      await this.updatePostColumn({
        id: postId,
        column: 'likes',
        value: --post.likes,
      });
      return await this.userService.updateUserRelationById({
        id: user.id,
        relation: 'likedPosts',
        add: false,
        value: postId,
      });
    }
  }
}
