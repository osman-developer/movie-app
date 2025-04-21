import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddRatingDto } from './dto/addRating.dto';
import { RatingsService } from './rating.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post('add-rate')
  @ApiOperation({ summary: 'Add or update a rating for a movie' })
  @ApiResponse({
    status: 200,
    description: 'Rating added or updated successfully',
  })
  @ApiBody({ type: AddRatingDto })
  @ApiResponse({
    status: 404,
    description: 'User or Movie not found',
  })
  async addRating(@Body() addRatingDto: AddRatingDto) {
    return this.ratingsService.addRating(addRatingDto);
  }

  @Delete('remove-rate/:userId/:externalMovieId')
  async removeRating(
    @Param('userId') userId: number,
    @Param('externalMovieId') externalMovieId: number,
  ) {
    return this.ratingsService.removeRating(userId, externalMovieId);
  }
}
