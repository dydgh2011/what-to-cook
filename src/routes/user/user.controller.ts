import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Render,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream } from 'fs';
import { BypassEmailVerification } from 'src/decorators/bypass-email-verification.decorator';
import { Public } from 'src/decorators/public.decorator';
import { IsPage } from 'src/decorators/page.decorator';
import { ClientGetUserReqDTO, UpdateUserDto } from './dto/req.dto';
import { ExampleObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ClientGetUserResDTO } from './dto/res.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: 'get user profile page',
    description: 'it returns user profile page',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID, UUID version 4',
    type: String,
    examples: {
      example1: {
        value: '95e48f4b-e6cd-4b1d-adf6-0ba86a2a0167',
        description: 'Random UUID (version 4)',
      } as ExampleObject,
      example2: {
        value: 'e2d02496-58b6-499d-8ad1-479017b5b4f7',
        description: 'Random UUID (version 4)',
      } as ExampleObject,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User profile page rendered successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Public()
  @IsPage()
  @Get('/profile/:id')
  @Render('pages/user')
  async getPage(@Param('id') userId: string) {
    const user = await this.userService.getUserById({
      id: userId,
    });
    if (!user) {
      throw new HttpException('no user found', 404);
    }
  }

  @ApiOperation({
    summary: 'Get user info',
    description:
      'it returns user info according to described column and relation, user can use this api without email verification but should be log in',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User info sent',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @BypassEmailVerification()
  @Post('')
  async getUser(
    @Body() data: ClientGetUserReqDTO,
  ): Promise<ClientGetUserResDTO> {
    const user = await this.userService.getUserById(data);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      tastes: user.tastes,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      posts: user.posts,
      comments: user.comments,
      likedPosts: user.likedPosts,
      friends: user.friends,
      sentFriendRequests: user.sentFriendRequests,
      receivedFriendRequests: user.receivedFriendRequests,
      notifications: user.notifications,
    };
  }

  @ApiOperation({
    summary: 'Get user profile picture',
    description:
      "Returns user's profile picture. User can use this API without email verification but should be logged in",
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    description: 'User ID (UUID version 4)',
    required: true,
    example: '95e48f4b-e6cd-4b1d-adf6-0ba86a2a0167',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile picture sent',
    content: {
      'image/jpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @BypassEmailVerification()
  @Get('get-profile-picture')
  async getProfilePicture(@Query('id') id: string, @Res() res) {
    const filename = await this.userService.getProfilePicture(id);
    if (filename === '') {
      res.status(404).send('No profile picture found!');
    } else {
      const filePath = join(__dirname, '../../../', 'user_files', filename);
      const fileExtension = extname(filename).toLowerCase();

      let contentType = 'image/jpeg';
      if (fileExtension === '.png') {
        contentType = 'image/png';
      } else if (fileExtension === '.jpg') {
        contentType = 'image/jpeg';
      }

      res.setHeader('Content-Type', contentType);
      const file = createReadStream(filePath);
      file.pipe(res);
    }
  }

  @ApiOperation({
    summary: 'Get user cover picture',
    description:
      "Returns user's cover picture. User can use this API without email verification but should be logged in",
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    description: 'User ID (UUID version 4)',
    required: true,
    example: '95e48f4b-e6cd-4b1d-adf6-0ba86a2a0167',
  })
  @ApiResponse({
    status: 200,
    description: 'User cover picture sent',
    content: {
      'image/jpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Cover picture not found' })
  @BypassEmailVerification()
  @Get('get-cover-picture')
  async getCoverPicture(@Query('id') id: string, @Res() res) {
    const filename = await this.userService.getCoverPicture(id);
    if (filename === '') {
      res.status(404).send('No cover picture found!');
      return;
    } else {
      const filePath = join(__dirname, '../../../', 'user_files', filename);
      const fileExtension = extname(filename).toLowerCase();

      let contentType = 'image/jpeg'; // default to jpeg
      if (fileExtension === '.png') {
        contentType = 'image/png';
      } else if (fileExtension === '.jpg') {
        contentType = 'image/jpeg';
      }

      res.setHeader('Content-Type', contentType);
      const file = createReadStream(filePath);
      file.pipe(res);
    }
  }

  @ApiOperation({
    summary: 'Update user profile',
    description:
      'Updates the user profile including profile picture and cover picture',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User profile data',
    schema: {
      type: 'object',
      properties: {
        profilePicture: {
          type: 'string',
          format: 'binary',
          description: "User's profile picture (JPG, JPEG, PNG)",
        },
        coverPicture: {
          type: 'string',
          format: 'binary',
          description: "User's cover picture (JPG, JPEG, PNG)",
        },
        username: {
          type: 'string',
          description:
            'Username, max 50, min 1, only contains letters and numbers',
          example: 'MarkNam2011',
        },
        tastes: {
          type: 'string',
          description:
            'User tastes, max 200, min 0, can contain letters, numbers, commas, and spaces',
          example: 'Sweet, Spicy',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiBearerAuth()
  @Put()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePicture', maxCount: 1 },
        { name: 'coverPicture', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './user_files',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(
              new Error('Only JPG, JPEG, and PNG files are allowed!'),
              false,
            );
          }
          cb(null, true);
        },
        limits: {
          fileSize: 2 * 1024 * 1024, // 2 MB
        },
      },
    ),
  )
  async updateUser(
    @Body() data: UpdateUserDto,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      coverPicture?: Express.Multer.File[];
    },
    @Req() req,
    @Res() res,
  ): Promise<void> {
    const { username, tastes } = data;
    let profilePicture: string = null;
    let coverPicture: string = null;

    if (files.profilePicture && files.profilePicture.length > 0) {
      profilePicture = files.profilePicture[0].filename;
    }

    if (files.coverPicture && files.coverPicture.length > 0) {
      coverPicture = files.coverPicture[0].filename;
    }

    const user = req.user;
    await this.userService.updateUserWhole(
      username,
      tastes,
      profilePicture,
      coverPicture,
      user.id,
    );

    res.status(HttpStatus.OK).send('User profile updated successfully');
  }

  @ApiOperation({
    summary: 'Delete user account',
    description:
      'Deletes the user account based on the authenticated user information.',
  })
  @ApiResponse({
    status: 200,
    description: 'User account deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiBearerAuth()
  @Delete()
  async deleteUser(@Req() req): Promise<void> {
    await this.userService.deleteUser(req.user);
    return;
  }
}
