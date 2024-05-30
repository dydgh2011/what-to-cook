import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export type postFields =
  | 'title'
  | 'content'
  | 'description'
  | 'thumbnail'
  | 'likes';

export class UpdatePostDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'id of the post, UUID v4',
    example: 'e4bc4169-82f5-43cb-b5f2-d77099b7a087',
  })
  @IsNotEmpty()
  @IsUUID(4)
  id: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'title, max 25, min 1, html sanitized',
    example: 'Great Fried Egg',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  title: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'description, max 200, min 1, html sanitized',
    example: 'It is Food, It is Good',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  description: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'content, max 2000, min 1, html sanitized',
    example: 'Put egg on the pan, done.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  content: string;
}

export class CreatePostDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'title, max 25, min 1, html sanitized',
    example: 'Great Fried Egg',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  title: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'description, max 200, min 1, html sanitized',
    example: 'It is Food, It is Good',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  description: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'content, max 2000, min 1, html sanitized',
    example: 'Put egg on the pan, done.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  content: string;
}

export class deletePostDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'id of the post, UUID v4',
    example: 'e4bc4169-82f5-43cb-b5f2-d77099b7a087',
  })
  @IsNotEmpty()
  @IsUUID(4)
  id: string;
}
