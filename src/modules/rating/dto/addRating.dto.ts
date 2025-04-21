import { ApiProperty } from "@nestjs/swagger";

export class AddRatingDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  externalMovieId: number;

  @ApiProperty()
  value: number;
}
