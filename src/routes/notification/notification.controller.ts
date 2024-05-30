import { Body, Controller, Delete, Get, Query, Req, Res } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { DeleteNotificationReqDto } from './dto/req.dto';
import { join } from 'path';
import { createReadStream } from 'fs';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Get notifications',
    description: 'Returns notifications for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  @ApiBearerAuth()
  @Get()
  async getNotifications(@Req() req) {
    return await this.notificationService.getNotifications(req.user);
  }

  @ApiOperation({
    summary: 'Delete notification',
    description:
      'Deletes the specified notification for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @Delete()
  async deleteNotification(@Req() req, @Body() data: DeleteNotificationReqDto) {
    const { id } = data;
    return await this.notificationService.deleteNotification(id, req.user);
  }

  @ApiOperation({
    summary: 'Get notification image',
    description:
      'Returns the image associated with the specified notification.',
  })
  @ApiResponse({ status: 200, description: 'Image retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @ApiQuery({
    name: 'filename',
    description: 'Filename of the image',
    required: true,
  })
  @ApiBearerAuth()
  @Get('/get-notification-image')
  async getThumbnail(@Query('filename') filename: string, @Res() res) {
    const filePath = join(__dirname, '../../../', 'user_files', filename);
    const file = createReadStream(filePath);
    file.pipe(res);
  }
}
