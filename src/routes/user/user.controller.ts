import { UserService } from './user.service';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { Role } from 'src/decorators/role.decorator';

@Role('admin')
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  async getUsers() {
    //FIXME: add pagination
    return await this.userService.getUsers();
  }

  @Public()
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (user) {
      return user;
    }
  }

  //friend request and accept
}
