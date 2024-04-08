import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The content of the post',
    required: true,
    example: 'blah blah blah...',
  })
  content: string;
}
