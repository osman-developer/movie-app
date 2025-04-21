import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UserService;
  let userRepo: Partial<Repository<User>>;

  beforeEach(async () => {
    userRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //testing create user
  it('should create and save a user', async () => {
    const dto = {
      name: 'othman',
      email: 'othman@live.com',
      password: 'password',
    };
    const createdUser = { ...dto };
    const savedUser = { id: 1, ...dto };

    (userRepo.create as jest.Mock).mockReturnValue(createdUser);
    (userRepo.save as jest.Mock).mockResolvedValue(savedUser);

    const result = await service.create(dto);

    expect(userRepo.create).toHaveBeenCalledWith(dto);
    expect(userRepo.save).toHaveBeenCalledWith(createdUser);
    expect(result).toEqual(savedUser);
  });
});
