import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Request,
  Response,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UserService } from './routes/user/user.service';
import { CreateUserDto } from './routes/user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get()
  @Render('pages/index')
  root(@Request() req) {
    return { user: req.user, baseURL: this.configService.get('BASE_URL') };
  }

  @Public()
  @Get('about')
  @Render('pages/about')
  about() {
    return { user: null };
  }

  @Public()
  @Get('login')
  login(@Request() req, @Response() res) {
    if (req.headers['authorization']) {
      return res.status(302).redirect('/');
    }
    return res.render('login', {
      message: 'login form',
    });
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Request() req) {
    return await this.authService.logIn(req.user);
  }
  // FIXME: implement the following
  //login with google (post)
  //login with twitter (post)
  //login with facebook (post)

  @Public()
  @Get('signup')
  signUpPage(@Request() req, @Response() res) {
    if (req.headers['authorization']) {
      return res.status(302).redirect('/');
    }
    return res.render('signup', {
      message: 'signup form',
    });
  }

  @Public()
  @Post('signup')
  async signUp(@Body(new ValidationPipe()) data: CreateUserDto) {
    return await this.authService.signUp(data);
  }

  //implement refresh token feature
  // @Post('refresh')
  // async refresh(@Headers('authorization') authorization: string) {
  //   const token = /Bearer\/s(.+)/.exec(authorization)[1];
  // }
}
