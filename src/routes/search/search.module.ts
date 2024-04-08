import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [SearchController],
  providers: [SearchService, ConfigService],
})
export class SearchModule {}
