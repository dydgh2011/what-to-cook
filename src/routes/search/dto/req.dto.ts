import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SearchReqDTO {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  ingredients: string;
}
