import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  IsEmail,
  Matches,
} from 'class-validator';
import { VerificationMethod } from 'src/entities/data-types-for-entities';
export type UserField =
  | 'id'
  | 'username'
  | 'verificationMethod'
  | 'verificationValue'
  | 'email'
  | 'password'
  | 'accessTokenVersion'
  | 'refreshTokenVersion'
  | 'emailConfirmed'
  | 'emailVerificationToken'
  | 'passwordResetToken'
  | 'role'
  | 'createdAt'
  | 'tastes'
  | 'profilePicture'
  | 'coverPicture';
const userFields: UserField[] = [
  'id',
  'username',
  'verificationMethod',
  'verificationValue',
  'email',
  'password',
  'accessTokenVersion',
  'refreshTokenVersion',
  'emailConfirmed',
  'emailVerificationToken',
  'passwordResetToken',
  'role',
  'createdAt',
  'tastes',
  'profilePicture',
  'coverPicture',
];

export type ClientUserField =
  | 'id'
  | 'username'
  | 'email'
  | 'tastes'
  | 'profilePicture'
  | 'coverPicture'
  | 'verificationMethod'
  | 'verificationValue';
const clientUserFields: ClientUserField[] = [
  'id',
  'username',
  'email',
  'tastes',
  'profilePicture',
  'coverPicture',
  'verificationMethod',
  'verificationValue',
];

export type UserRelation =
  | 'posts'
  | 'comments'
  | 'likedPosts'
  | 'friends'
  | 'sentFriendRequests'
  | 'receivedFriendRequests'
  | 'notifications';
const userRelations: UserRelation[] = [
  'posts',
  'comments',
  'likedPosts',
  'friends',
  'sentFriendRequests',
  'receivedFriendRequests',
  'notifications',
];

@ValidatorConstraint({ name: 'IsUserField', async: false })
export class IsUserField implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, args: ValidationArguments) {
    return this.isValid(value);
  }

  private isValid(arr: any[]): boolean {
    for (const elem of arr) {
      if (!userFields.includes(elem)) {
        return false;
      }
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Each element of the array must be in user fields.';
  }
}
@ValidatorConstraint({ name: 'IsClientUserField', async: false })
export class IsClientUserField implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, args: ValidationArguments) {
    return this.isValid(value);
  }

  private isValid(arr: any[]): boolean {
    for (const elem of arr) {
      if (!clientUserFields.includes(elem)) {
        return false;
      }
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Each element of the array must be in user fields.';
  }
}
@ValidatorConstraint({ name: 'isNumberArray', async: false })
export class IsUserRelation implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, args: ValidationArguments) {
    return this.isValid(value);
  }

  private isValid(arr: any[]): boolean {
    for (const elem of arr) {
      if (!userRelations.includes(elem)) {
        return false;
      }
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Each element of the array must be in user relations.';
  }
}

export class CreateUserReqDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  username: string;
  @IsNotEmpty()
  verificationMethod: VerificationMethod;
  @IsNotEmpty()
  verificationValue: string;
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    {
      message:
        'password must be Minimum eight and maximum 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password?: string;
}

export class ClientGetUserReqDTO {
  @ApiProperty({
    description: 'User ID (UUID version 4)',
    example: '95e48f4b-e6cd-4b1d-adf6-0ba86a2a0167',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'List of user fields to include',
    example: clientUserFields,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Validate(IsClientUserField)
  userFields?: ClientUserField[];

  @ApiProperty({
    description: 'List of relations to include',
    example: userRelations,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Validate(IsUserRelation)
  relations?: UserRelation[];
}

export class GetUserReqDTO {
  verificationMethod: VerificationMethod;
  verificationValue: string;
  userFields?: UserField[];
  relations?: UserRelation[];
}

export class UpdateUserReqDTO extends GetUserReqDTO {
  column: UserField;
  value: number | string;
}

export class GetUserByIdReqDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsArray()
  userFields?: UserField[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Validate(IsUserRelation)
  relations?: UserRelation[];
}

export class UpdateUserByIdReqDTO extends GetUserByIdReqDTO {
  column: UserField;
  value: number | string;
}

export class UpdateUserRelationByIdReqDTO extends GetUserByIdReqDTO {
  relation: UserRelation;
  add: boolean;
  value: string;
}

export class UpdateUserDto {
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
    required: false,
    description:
      'User tastes, max 200, min 0, can contain letters, numbers, commas, and spaces',
    example: 'Sweet, Spicy',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Matches(/^[가-힣a-zA-Z0-9, ]*$/, {
    message: 'Tastes can only contain letters, numbers, commas, and spaces',
  })
  tastes?: string;
}
