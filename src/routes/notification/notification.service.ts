import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/entities/notification.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  async getNotifications(user: UserEntity) {
    const userId = user.id;
    const query = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .orderBy('notification.createdAt', 'DESC')
      .where('user.id = :userId', { userId });

    const notifications = await query.getMany();
    return notifications;
  }

  async getNotification(id: string) {
    return await this.notificationRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async createNotification(data: {
    title: string;
    content: string;
    user: UserEntity;
    image: string;
  }) {
    const { title, content, image, user } = data;
    return await this.notificationRepository.save({
      title,
      content,
      image,
      user,
    });
  }

  async deleteNotification(id: string, user: UserEntity) {
    const notification = await this.getNotification(id);
    if (!notification) {
      throw new Error('notification not found');
    }

    if (notification.user.id !== user.id) {
      throw new Error('You do not have permission to delete this notification');
    }

    await this.notificationRepository.remove(notification);
  }
}
