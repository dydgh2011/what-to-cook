import { Module } from '@nestjs/common';
import { ClaimController } from './claim.controller';
import { ClaimService } from './claim.service';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimEntity } from 'src/entities/claim.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClaimEntity]), MailModule],
  controllers: [ClaimController],
  providers: [ClaimService, MailService],
})
export class ClaimModule {}
