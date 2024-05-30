import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaimEntity } from 'src/entities/claim.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private claimRepository: Repository<ClaimEntity>,
  ) {}

  async uploadClaim(os: string, browser: string, message: string) {
    return await this.claimRepository.save({
      os,
      browser,
      message,
    });
  }
}
