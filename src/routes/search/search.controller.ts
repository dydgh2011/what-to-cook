import { Controller, Get, Query, Render, Request } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from 'src/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { IsPage } from 'src/decorators/page.decorator';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  //set the limit of 10 requests per minute
  @Public()
  @IsPage()
  @Get('')
  @Render('pages/result')
  async search(@Query('search') ingredients: string, @Request() req) {
    // if it's empty return error code
    const { result, datas } = await this.searchService.search(ingredients);
    if (result.includes('ERROR')) {
      return {
        result: result,
        user: req.user,
        datas: datas,
        error: true,
      };
    } else {
      return {
        result: result,
        user: req.user,
        datas: datas,
        error: false,
      };
    }
  }
}
