import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsNumber()
  /**
   * The id of the user who created the post
   * @example 12331
   */
  userId: number;

  /**
   * The title of the post
   * @example "Recipe for the best chocolate cake ever!"
   */
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  title: string;

  /**
   * the content of the post
   * @example "blah blah blah..."
   */
  @IsNotEmpty()
  content: string;
}
