import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';
import { Watchlist } from './watchlist.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@ApiTags('Watchlist')
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user watchlist' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved watchlist.',
  })
  async getWatchlist(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Watchlist[]> {
    return this.watchlistService.getWatchlistForUser(userId);
  }

  @Post(':userId/:externalMovieId')
  @ApiOperation({ summary: 'Add a movie to user watchlist' })
  @ApiResponse({ status: 201, description: 'Movie added to watchlist.' })
  @ApiResponse({ status: 200, description: 'Movie already in watchlist.' })
  async add(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('externalMovieId', ParseIntPipe) externalMovieId: number,
  ): Promise<void> {
    return this.watchlistService.addToWatchlist(userId, externalMovieId);
  }

  @Delete(':userId/:externalMovieId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove a movie from user watchlist' })
  @ApiResponse({ status: 204, description: 'Movie removed from watchlist.' })
  async remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('externalMovieId', ParseIntPipe) externalMovieId: number,
  ): Promise<void> {
    return this.watchlistService.removeFromWatchlist(userId, externalMovieId);
  }
}
