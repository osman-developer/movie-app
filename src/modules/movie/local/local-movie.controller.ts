import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LocalMoviesService } from './local-movies.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetMovieDto } from './dto/getMovie.dto';

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
}
