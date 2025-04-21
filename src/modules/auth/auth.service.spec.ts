import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  const userService = { findByEmail: jest.fn() };
  const jwtService = { signAsync: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  it('should return user ID if credentials are valid', async () => {
    const user = { id: 1, password: 'zz' };
    userService.findByEmail.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true as boolean);

    const result = await service.validateUser('test@mail.com', 'pass');
    expect(result).toEqual({ id: 1 });
  });

  it('should throw if user not found', async () => {
    userService.findByEmail.mockResolvedValue(null);

    await expect(
      service.validateUser('notfound@mail.com', 'pass'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return JWT token on login', async () => {
    jwtService.signAsync.mockResolvedValue('token123');

    const result = await service.login(1);
    expect(result).toEqual({ id: 1, token: 'token123' });
  });
});
