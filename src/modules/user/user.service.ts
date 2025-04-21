import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddUserDto } from './dto/addUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(addUserDto: AddUserDto) {
    //since we have a trigger to hash pwd, we should first create the user then save it to db
    //here i am returning all the user obj even with password just to show hashing (ofc we shouldn't return password)
    const user = await this.userRepository.create(addUserDto);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findOne(userId: number) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: ['name'],
    });
  }
}
