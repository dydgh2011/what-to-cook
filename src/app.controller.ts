import { Controller, Get, Render } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { IsPage } from './decorators/page.decorator';
import { MailService } from './mail/mail.service';
import { TokenPayload } from './auth/dto/req.dto';
import { ClaimEntity } from './entities/claim.entity';

@ApiExtraModels(TokenPayload, ClaimEntity)
@ApiTags('Pages')
@Controller()
export class AppController {
  constructor(private mailService: MailService) {}

  @ApiOperation({
    summary: 'Index Page',
    description: 'it simply returns index page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('')
  @Render('pages/index')
  async root() {}

  @ApiOperation({
    summary: 'About Page',
    description: 'it returns about page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('about')
  @Render('pages/about')
  about() {}

  @ApiOperation({
    summary: 'Sign Up/In Page',
    description: 'it returns Sign Up/In page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('sign')
  @Render('pages/sign')
  sign() {}

  @ApiOperation({
    summary: 'Settings Page',
    description: 'it returns Settings page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('settings')
  @Render('pages/settings')
  settings() {}

  @ApiOperation({
    summary: 'Notifications Page',
    description: 'it returns Notifications page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('notifications')
  @Render('pages/notifications')
  notifications() {}

  @ApiOperation({
    summary: 'Profile Page',
    description: 'it returns Profile page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('profile')
  @Render('pages/profile')
  profile() {}

  @ApiOperation({
    summary: 'Claim Page',
    description: 'it returns Claim page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('claim')
  @Render('pages/claim')
  claim() {}

  @ApiOperation({
    summary: 'Email Verification Page',
    description: 'it returns Email Verification page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('email-verification')
  @Render('pages/email-verification-page')
  emailVerification() {}

  @ApiOperation({
    summary: 'Email Verification Notification Page',
    description: 'it returns Email Verification Notification page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('email-verification-notification')
  @Render('pages/email-verification-notification')
  emailVerificationNotification() {}

  @ApiOperation({
    summary: 'Community Page',
    description: 'it returns Community page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('community')
  @Render('pages/community')
  community() {}

  @ApiOperation({
    summary: 'Friends Page',
    description: 'it returns Friends page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('friends')
  @Render('pages/friends')
  friends() {}

  //Policy ------------------------------------------------
  @ApiOperation({
    summary: 'Privacy Policy Page',
    description: 'it returns Privacy Policy page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('privacy-policy')
  @Render('pages/privacy-policy')
  privacyPolicy() {}

  @ApiOperation({
    summary: 'Terms of Service Page',
    description: 'it returns Terms of Service page',
  })
  @ApiResponse({
    status: 200,
    description: 'The rendered page has been successfully sent.',
  })
  @Public()
  @IsPage()
  @Get('terms-of-service')
  @Render('pages/terms-of-service')
  termsOfService() {}
}
