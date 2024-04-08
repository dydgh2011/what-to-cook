import {
  Get,
  Post,
  Controller,
  Delete,
  Put,
  Body,
  Param,
  Injectable,
  ValidationPipe,
  Ip,
  ParseIntPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import {
  ApiCreatedResponse,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ConfigService } from '@nestjs/config';

@Controller('board')
@ApiTags('Board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'The posts' })
  getPosts() {
    return this.boardService.findAll();
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The post has been successfully created.',
    type: String,
  })
  createPost(@Body(new ValidationPipe()) data: CreatePostDto) {
    //check if the user is allowed to access the API
    // check if user's id matches to loged in user's id

    return this.boardService.createPost(data);
  }

  @Put(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdatePostDto,
  ) {
    //check if user is loged in
    // check if user's id matches to loged in user's id
    //check if user's id matchec post's user id
    return this.boardService.updatePost(id, data);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    //check if user is loged in
    // check if user's id matches to loged in user's id
    //check if user's id matchec post's user id
    return this.boardService.deletePost(id);
  }
}
