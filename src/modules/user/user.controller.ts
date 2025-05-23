import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddUserDto } from './dto/addUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  @ApiOperation({ summary: 'Add a user' })
  @ApiResponse({
    status: 200,
    description: 'User is added or updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiBody({type:AddUserDto})
  async create(@Body() addUserDto: AddUserDto) {
    return this.userService.create(addUserDto);
  }
}
