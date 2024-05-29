import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export type tokenType = [string, string];

export class TokenPayload {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'users id, UUID v4',
    example: '336546e5-391b-4a8b-aac7-e3c811caaba7',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'Username, max 50, min 1, only contains letters and numbers',
    example: 'MarkNam2011',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'users id for logging in',
    example: 'MarkNam2011',
  })
  userId: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'version of the token, from 0 to 9',
    example: 1,
  })
  tokenVersion: number;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'it is either access or refresh',
    example: 'access',
  })
  type: tokenType;
}

export class LocalSignUpReqDTO {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'Username, max 50, min 1, only contains letters and numbers',
    example: 'MarkNam2011',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  @Matches(/^[가-힣a-zA-Z0-9]*$/, {
    message: 'Username can only contain letters and numbers',
  })
  username: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'User Id , max 50, min 1, only contains letters and numbers',
    example: 'MarkNam2011',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'ID can only contain letters and numbers',
  })
  verificationValue: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'users email',
    example: 'demo@nestjs.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description:
      'users password, password must be Minimum eight and maximum 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    example: 'Dragon1234@!!',
  })
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    {
      message:
        'password must be Minimum eight and maximum 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;
}

export class ResetPasswordReqDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'User Id , max 50, min 1, only contains letters and numbers',
    example: 'MarkNam2011',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'ID can only contain letters and numbers',
  })
  userId: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description:
      'users new password, password must be Minimum eight and maximum 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    example: 'Dragon1234@!!',
  })
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    {
      message:
        'password must be Minimum eight and maximum 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  newPassword: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'Random token for refresh password',
    example: 'afudkjfnsdkufef21osd8f',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
