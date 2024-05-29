import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteNotificationReqDto {
  @ApiProperty({
    name: 'notification id uuid version 4',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
