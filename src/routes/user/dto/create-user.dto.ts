import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  /**
   * user's username
   * minimum length of the username is 3 characters
   * maximum length of the username is 30 characters
   * username can't contain special characters or spaces(!, ' ', #, $, %, etc.)
   * @example 'user123'
   */
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  /**
   * user's password
   * minimum length of the password is 8 characters
   * maximum length of the password is 40 characters
   * password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)
   * @example 'Password123!'
   */
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(40)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,40}$/,
  )
  password: string;

  /**
   * email of the user
   * @example 'dontdothis@gmail.com'
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
