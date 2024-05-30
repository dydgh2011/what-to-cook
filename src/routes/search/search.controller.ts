import { Controller, Get, Query, Render, Request, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from 'src/decorators/public.decorator';
import { IsPage } from 'src/decorators/page.decorator';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({
    summary: 'Search for recipes by ingredients',
    description:
      'Returns search results for recipes based on the provided ingredients.',
  })
  @ApiQuery({
    name: 'search',
    description: 'Ingredients to search for recipes, max 50 characters',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Search results returned successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Public()
  @IsPage()
  @Get('')
  @Render('pages/result')
  async search(
    @Query('search') ingredients: string,
    @Request() req,
    @Res() res,
  ) {
    if (!ingredients) {
      res.status(401).send('Ingredients must not be empty!');
    }
    if (ingredients.length < 1) {
      res.status(401).send('Ingredients must not be empty!');
    } else if (ingredients.length > 50) {
      res.status(401).send('Ingredients must not be longer than 50 characters');
    }
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
