import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { ClaimService } from './claim.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Claim')
@Controller('claim')
export class ClaimController {
  constructor(private claimService: ClaimService) {}

  @ApiOperation({
    summary: 'Submit claim',
    description: 'Submits a claim with the provided information.',
  })
  @ApiResponse({ status: 201, description: 'Claim submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Public()
  @Post('')
  async claimMail(@Body() data) {
    const { os, browser, message } = data;
    return this.claimService.uploadClaim(os, browser, message);
  }
}
