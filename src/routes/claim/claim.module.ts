import { Module } from '@nestjs/common';
import { ClaimController } from './claim.controller';
import { ClaimService } from './claim.service';

@Module({
  controllers: [ClaimController],
  providers: [ClaimService],
})
export class ClaimModule {}
