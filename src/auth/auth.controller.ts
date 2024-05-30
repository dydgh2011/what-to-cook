import {
  Controller,
  UseGuards,
  Request,
  Body,
  Get,
  Render,
  Response,
  Post,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { IsPage } from 'src/decorators/page.decorator';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from './google-auth.guard';
import { UserService } from 'src/routes/user/user.service';
import { FacebookAuthGuard } from './facebook-auth.guard';
import { TwitterAuthGuard } from './twitter-auth.guard';
import { VerificationMethod } from 'src/entities/data-types-for-entities';
import { LocalSignUpReqDTO, ResetPasswordReqDto } from './dto/req.dto';
import { MailService } from 'src/mail/mail.service';
import { BypassEmailVerification } from 'src/decorators/bypass-email-verification.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  @ApiOperation({
    summary: 'Login with Local auth',
    description:
      'it requires local id and password to login and returns jwt tokens',
  })
  @ApiBody({
    description: 'User id and password',
    schema: {
      type: 'object',
      properties: {
        localId: {
          type: 'string',
          description: 'Users local ID',
          example: 'MarkNamtesting31',
        },
        password: {
          type: 'string',
          description: 'Users password',
          example: 'MarkNamtesting31',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Users accessToken and refreshToken',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'access token',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMzNjU0NmU1LTM5MWItNGE4Yi1hYWM3LWUzYzgxMWNhYWJhNyIsInVzZXJuYW1lIjoiTWFya05hbXRlc3RpbmczMSIsInRva2VuVmVyc2lvbiI6NiwidHlwZSI6ImFjY2VzcyIsImVtYWlsQ29uZmlybWVkIjp0cnVlLCJpYXQiOjE3MTY5ODk3NDUsImV4cCI6MTcxNjk5MTU0NX0.o9s8aFbqmgcL6yS5nUkl8Xe6hcgnSVmL4WuQeEWkIM4',
        },
        refreshToken: {
          type: 'string',
          description: 'refresh token',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMzNjU0NmU1LTM5MWItNGE4Yi1hYWM3LWUzYzgxMWNhYWJhNyIsInVzZXJuYW1lIjoiTWFya05hbXRlc3RpbmczMSIsInRva2VuVmVyc2lvbiI6NiwidHlwZSI6InJlZnJlc2giLCJlbWFpbENvbmZpcm1lZCI6dHJ1ZSwiaWF0IjoxNzE2OTg5NzQ1LCJleHAiOjE3MTc1OTQ1NDV9.nxYYTLxaOwjW0el7eb7nb7uAh3srslJ6yAR2HaHLt5E',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorize' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req) {
    return await this.authService.logIn(req.user);
  }

  @ApiOperation({
    summary: 'Login with Local auth',
    description:
      'it requires local id and password to login and returns jwt tokens',
  })
  @ApiResponse({
    status: 201,
    description: 'Users accessToken and refreshToken',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'access token',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMzNjU0NmU1LTM5MWItNGE4Yi1hYWM3LWUzYzgxMWNhYWJhNyIsInVzZXJuYW1lIjoiTWFya05hbXRlc3RpbmczMSIsInRva2VuVmVyc2lvbiI6NiwidHlwZSI6ImFjY2VzcyIsImVtYWlsQ29uZmlybWVkIjp0cnVlLCJpYXQiOjE3MTY5ODk3NDUsImV4cCI6MTcxNjk5MTU0NX0.o9s8aFbqmgcL6yS5nUkl8Xe6hcgnSVmL4WuQeEWkIM4',
        },
        refreshToken: {
          type: 'string',
          description: 'refresh token',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMzNjU0NmU1LTM5MWItNGE4Yi1hYWM3LWUzYzgxMWNhYWJhNyIsInVzZXJuYW1lIjoiTWFya05hbXRlc3RpbmczMSIsInRva2VuVmVyc2lvbiI6NiwidHlwZSI6InJlZnJlc2giLCJlbWFpbENvbmZpcm1lZCI6dHJ1ZSwiaWF0IjoxNzE2OTg5NzQ1LCJleHAiOjE3MTc1OTQ1NDV9.nxYYTLxaOwjW0el7eb7nb7uAh3srslJ6yAR2HaHLt5E',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'BadRequest' })
  @Public()
  @Post('signup')
  async signUp(@Body() data: LocalSignUpReqDTO) {
    const { username, email, password, verificationValue } = data;
    return await this.authService.signUp({
      username,
      email,
      password,
      verificationMethod: VerificationMethod.LOCAL,
      verificationValue,
    });
  }

  @ApiOperation({
    summary: 'Google Authentication',
    description: 'Initiate Google authentication process.',
  })
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {}

  @ApiOperation({
    summary: 'Google Authentication Callback',
    description: 'Callback endpoint for Google authentication.',
  })
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(@Request() req, @Response() res) {
    const provider = VerificationMethod.GOOGLE;
    const id = req.user.id;
    const username = req.user.username;

    let user = await this.userService.getUser({
      verificationMethod: provider,
      verificationValue: id,
      userFields: [
        'username',
        'verificationMethod',
        'verificationValue',
        'email',
        'password',
        'accessTokenVersion',
        'refreshTokenVersion',
        'emailConfirmed',
        'role',
      ],
    });
    if (!user) {
      // user sign up
      const userInfo = {
        username: username,
        verificationMethod: VerificationMethod.GOOGLE,
        verificationValue: id,
      };
      await this.authService.signUp(userInfo);
      user = await this.userService.getUser({
        verificationMethod: VerificationMethod.GOOGLE,
        verificationValue: id,
        userFields: [
          'username',
          'verificationMethod',
          'verificationValue',
          'email',
          'password',
          'accessTokenVersion',
          'refreshTokenVersion',
          'emailConfirmed',
          'role',
        ],
      });
    }
    // think about more secure way to do this
    const tokens = await this.authService.logIn(user);
    res.cookie('accessToken', tokens.accessToken);
    res.cookie('refreshToken', tokens.refreshToken);
    return res.redirect('/');
  }

  @ApiOperation({
    summary: 'Facebook Authentication',
    description: 'Initiate Facebook authentication process.',
  })
  @Public()
  @UseGuards(FacebookAuthGuard)
  @Get('facebook')
  async facebookAuth() {}

  @ApiOperation({
    summary: 'Facebook Authentication Callback',
    description: 'Callback endpoint for Facebook authentication.',
  })
  @Public()
  @UseGuards(FacebookAuthGuard)
  @Get('facebook/callback')
  async facebookCallback(@Request() req, @Response() res) {
    const id = req.user.id;
    const username = req.user.username;
    let user = await this.userService.getUser({
      verificationMethod: VerificationMethod.FACEBOOK,
      verificationValue: id,
      userFields: [
        'username',
        'verificationMethod',
        'verificationValue',
        'email',
        'password',
        'accessTokenVersion',
        'refreshTokenVersion',
        'emailConfirmed',
        'role',
      ],
    });
    if (!user) {
      // user sign up
      const userInfo = {
        username: username,
        verificationMethod: VerificationMethod.FACEBOOK,
        verificationValue: id,
      };
      await this.authService.signUp(userInfo);
      user = await this.userService.getUser({
        verificationMethod: VerificationMethod.FACEBOOK,
        verificationValue: id,
        userFields: [
          'username',
          'verificationMethod',
          'verificationValue',
          'email',
          'password',
          'accessTokenVersion',
          'refreshTokenVersion',
          'emailConfirmed',
          'role',
        ],
      });
    }
    // think about more secure way to do this
    const tokens = await this.authService.logIn(user);
    res.cookie('accessToken', tokens.accessToken);
    res.cookie('refreshToken', tokens.refreshToken);
    return res.redirect('/');
  }

  @ApiOperation({
    summary: 'Twitter Authentication',
    description: 'Initiate Twitter authentication process.',
  })
  @Public()
  @UseGuards(TwitterAuthGuard)
  @Get('twitter')
  async twitterAuth() {}

  @ApiOperation({
    summary: 'Twitter Authentication Callback',
    description: 'Callback endpoint for Twitter authentication.',
  })
  @Public()
  @UseGuards(TwitterAuthGuard)
  @Get('twitter/callback')
  async twitterCallback(@Request() req, @Response() res) {
    const id = req.user.id;
    const username = req.user.username;
    let user = await this.userService.getUser({
      verificationMethod: VerificationMethod.TWITTER,
      verificationValue: id,
      userFields: [
        'username',
        'verificationMethod',
        'verificationValue',
        'email',
        'password',
        'accessTokenVersion',
        'refreshTokenVersion',
        'emailConfirmed',
        'role',
      ],
    });
    if (!user) {
      // user sign up
      const userInfo = {
        username: username,
        verificationMethod: VerificationMethod.TWITTER,
        verificationValue: id,
      };
      await this.authService.signUp(userInfo);
      user = await this.userService.getUser({
        verificationMethod: VerificationMethod.TWITTER,
        verificationValue: id,
        userFields: [
          'username',
          'verificationMethod',
          'verificationValue',
          'email',
          'password',
          'accessTokenVersion',
          'refreshTokenVersion',
          'emailConfirmed',
          'role',
        ],
      });
    }
    // think about more secure way to do this
    const tokens = await this.authService.logIn(user);
    res.cookie('accessToken', tokens.accessToken);
    res.cookie('refreshToken', tokens.refreshToken);
    return res.redirect('/');
  }

  //auth token ------------------------------------------------
  @ApiOperation({
    summary: 'Refresh Token',
    description: 'Refreshes the authentication token for the logged-in user.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @BypassEmailVerification()
  @Get('refresh')
  async refreshToken(@Request() req) {
    return await this.authService.logIn(req.user);
  }

  // email verification ------------------------------------------------
  @ApiOperation({
    summary: 'Resend Verification Email',
    description: 'Re-sends the verification email to the logged-in user.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Verification email resent successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @BypassEmailVerification()
  @Get('resend-verification-email')
  async resendVerificationEmail(@Request() req) {
    return await this.authService.resendVerificationMail(req.user);
  }

  @ApiOperation({
    summary: 'Email Verification Page',
    description: 'Displays the email verification page.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verification page displayed successfully',
  })
  @Public()
  @BypassEmailVerification()
  @IsPage()
  @Get('email-verification-page/:token')
  @Render('pages/email-verify')
  emailVerificationPage() {}

  @ApiOperation({
    summary: 'Verify Email',
    description: "Verifies the user's email address using the provided token.",
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @BypassEmailVerification()
  @Post('email-verification')
  async verifyEmail(@Body() data, @Request() req) {
    return await this.authService.verifyEmail(req.user, data.token);
  }

  @ApiOperation({
    summary: 'Check Email Verification Status',
    description: "Checks if the user's email address has been verified.",
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Email verification status checked successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @BypassEmailVerification()
  @Get('check-email-verification')
  checkEmailVerification(@Request() req) {
    return req.user.emailConfirmed;
  }

  // send reset password email ------------------------------------------------

  @ApiOperation({
    summary: 'Send Reset Password Email',
    description: 'Sends a reset password email to the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset password email sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @Public()
  @Post('send-reset-password-email')
  async sendResetPasswordEmail(@Body() data) {
    return await this.authService.sendResetPasswordMail(data.userId);
  }

  @ApiOperation({
    summary: 'Reset Password Page',
    description: 'Displays the reset password page.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset password page displayed successfully',
  })
  @Public()
  @BypassEmailVerification()
  @IsPage()
  @Get('reset-password-page/:token')
  @Render('pages/reset-password-form')
  resetPasswordPage() {}

  @ApiOperation({
    summary: 'Reset Password',
    description: "Resets the user's password using the provided token.",
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token or password' })
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordReqDto) {
    return await this.authService.resetPassword(
      data.userId,
      data.newPassword,
      data.token,
    );
  }
}
