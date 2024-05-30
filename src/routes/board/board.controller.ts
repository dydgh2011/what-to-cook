import {
  Get,
  Controller,
  ParseIntPipe,
  Query,
  Res,
  Render,
  Post,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  Put,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BoardService } from './board.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { extname, join } from 'path';
import { createReadStream } from 'fs';
import { IsPage } from 'src/decorators/page.decorator';
import { CreatePostDto, deletePostDto, UpdatePostDto } from './dto/req.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PostEntity } from 'src/entities/post.entity';
@Controller('board')
@ApiTags('Board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: 'Post Page',
    description: 'it returns Post page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('post/:id')
  @Render('pages/post')
  getPage() {}

  @ApiOperation({
    summary: 'Create Post Form Page',
    description: 'it simply returns Create Post Form page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('/post-create-form')
  @Render('pages/post-create-form')
  getCreateFormPage() {}

  @ApiOperation({
    summary: 'Create Update Form Page',
    description: 'it simply returns Create Update Form page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('/post-update-form/:id')
  @Render('pages/post-update-form')
  getUpdateFormPage() {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get posts',
    description: 'Retrieves a list of posts optionally filtered by user ID.',
  })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'userId',
    description: 'ID of the user whose posts are to be retrieved',
    required: false,
    example: '95e48f4b-e6cd-4b1d-adf6-0ba86a2a0167',
  })
  @Get('/posts')
  async getPosts(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('userId') userId?: string,
  ) {
    if (userId) {
      return await this.boardService.getPosts(page, limit, userId);
    } else {
      return await this.boardService.getPosts(page, limit);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get post by ID',
    description: 'Retrieves a single post by its ID.',
  })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No id given' })
  @ApiQuery({
    name: 'id',
    description: 'ID of the post to retrieve',
    required: true,
    example: '95e48f4b-e6cd-4b1d-adf6-0ba86a2a0167',
  })
  @Get('/post')
  async getPost(@Query('id') id: string): Promise<PostEntity> {
    if (!id) {
      throw new NotFoundException('No id given!');
    }
    const post = await this.boardService.getPost(id);
    console.log('post is', post);
    if (!post) {
      throw new Error('Post not found!');
    }
    return post;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get thumbnail by filename',
    description: 'Retrieves a thumbnail image by its filename.',
  })
  @ApiResponse({ status: 200, description: 'Thumbnail retrieved successfully' })
  @ApiQuery({
    name: 'filename',
    description: 'Name of the thumbnail file to retrieve',
    required: true,
    example: 'thumbnail.jpg',
  })
  @Get('/thumbnail')
  async getThumbnail(@Query('filename') filename: string, @Res() res) {
    const filePath = join(__dirname, '../../../', 'user_files', filename);
    const file = createReadStream(filePath);
    file.pipe(res);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new post with a thumbnail',
    description: 'Creates a new post with an associated thumbnail image.',
  })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Post data and thumbnail image',
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'thumbnail (JPG, JPEG, PNG)',
        },
        title: {
          type: 'string',
          description: 'title, max 25, min 1, html sanitized',
          example: 'Great Fried Egg',
        },
        description: {
          type: 'string',
          description: 'description, max 200, min 1, html sanitized',
          example: 'It is Food, It is Good',
        },
        content: {
          type: 'string',
          description: 'content, max 2000, min 1, html sanitized',
          example: 'Put egg on the pan, done.',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: './user_files',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new Error('Only JPG, JPEG, and PNG files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async createPost(
    @Body() data: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException('Thumbnail file is required');
    }
    return await this.boardService.createPost(data, req.user, file.filename);
  }

  @ApiOperation({
    summary: 'Update a post',
    description: 'Updates a post.',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Post data and thumbnail image',
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
          description: 'thumbnail (JPG, JPEG, PNG)',
        },
        title: {
          type: 'string',
          description: 'title, max 25, min 1, html sanitized',
          example: 'Great Fried Egg',
        },
        description: {
          type: 'string',
          description: 'description, max 200, min 1, html sanitized',
          example: 'It is Food, It is Good',
        },
        content: {
          type: 'string',
          description: 'content, max 2000, min 1, html sanitized',
          example: 'Put egg on the pan, done.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Put('')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: './user_files',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new Error('Only JPG, JPEG, and PNG files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async updatePost(
    @Body() data: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const thumbnailFilename = file ? file.filename : null;
    return await this.boardService.updatePost(
      data,
      req.user,
      thumbnailFilename,
    );
  }

  @ApiOperation({
    summary: 'Deletes a post',
    description: 'Deletes a post.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete('')
  async deletePost(@Body() data: deletePostDto, @Req() req) {
    return await this.boardService.deletePost(data.id, req.user);
  }

  @ApiOperation({
    summary: 'Post a comment',
    description:
      'Allows authenticated users to post a comment on a specific post.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Comment posted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('comment')
  async postComment(@Body() data, @Req() req) {
    const user = req.user;
    const { postId, content } = data;
    return await this.boardService.addComment(user.id, postId, content);
  }

  @ApiOperation({
    summary: 'Check if post is liked',
    description: 'Checks if a post is liked by the authenticated user.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Check successful' })
  @Get('isLicked')
  async isLicked(@Query('postId') postId: string, @Req() req) {
    return await this.boardService.checkIsLiked(postId, req.user.id);
  }

  @ApiOperation({
    summary: 'Like a post',
    description: 'Likes a specific post by the authenticated user.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Post liked successfully' })
  @Post('like')
  async like(@Body() data, @Req() req) {
    const { postId } = data;
    return await this.boardService.like(postId, req.user.id);
  }

  @ApiOperation({
    summary: 'Dislike a post',
    description: 'Dislikes a specific post by the authenticated user.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Post disliked successfully' })
  @Post('dislike')
  async dislike(@Body() data, @Req() req) {
    const { postId } = data;
    return await this.boardService.dislike(postId, req.user.id);
  }
}
