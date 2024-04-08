import { Inject, Injectable, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async findAll(): Promise<PostEntity[]> {
    return await this.postRepository.find();
  }

  async findOne(id: number): Promise<PostEntity> {
    return await this.postRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }

  async createPost(data: CreatePostDto) {
    try {
      const savedPost = this.postRepository.create(data);
      return await this.postRepository.save(savedPost);
    } catch (error) {
      throw new Error('Failed to create post: ' + error.message);
    }
  }

  async updatePost(id: number, data: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new Error('Post not found');
    }

    return await this.postRepository.update(id, { ...data });
  }

  async deletePost(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new Error('Post not found');
    }
    console.log(post);

    return await this.postRepository.remove(post);
  }
}
