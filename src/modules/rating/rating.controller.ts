import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AddRatingDto } from './dto/addRating.dto';
import { RatingsService } from './rating.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post('add-rate')
  @ApiOperation({ summary: 'Add or update a rating for a movie' })
  @ApiResponse({
    status: 200,
    description: 'Rating added or updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User or Movie not found',
  })
  async addRating(@Body() addRatingDto: AddRatingDto) {
    return this.ratingsService.addRating(addRatingDto);
  }
}
