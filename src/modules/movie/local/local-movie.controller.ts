import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocalMoviesService } from './local-movies.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetMovieDto } from './dto/getMovie.dto';
import { QueryParamsDto } from 'src/common/dtos/query-params.dto';
import { PaginatedResponse } from 'src/common/interfaces/local/paginated-response';

@Controller('movie')
export class LocalMovieController {
  constructor(private readonly localMovieService: LocalMoviesService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve detailed information for a specific movie',
  })
  @ApiResponse({
    status: 200,
    description: 'Movie details successfully retrieved',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async getMovieById(@Param('id', ParseIntPipe) id): Promise<GetMovieDto> {
    return this.localMovieService.getMovieById(Number.parseInt(id));
  }

  @Get()
  @ApiOperation({
    summary:
      'Call api with dynamic queriese.e.g :localhost:3000/movie?page=1&pageSize=6&searchTerm=Minecraft&filters=genre.name:Fantasy you can specify what you want {page,pageize,searchterm,filters all together or non, or a combination}',
  })
  @ApiResponse({
    status: 200,
    description:
      'Paginated list of movies (applying filters,searchterms.. if any)',
  })
  async getMovies(
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedResponse<GetMovieDto>> {
    return this.localMovieService.getMovies(new QueryParamsDto(query));
  }
}
