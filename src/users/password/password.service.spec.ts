import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should hash password', async () => {
    const mockHash = 'hashed_password';

    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
    const password = 'password';

    const result = await service.hash(password);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mockHash);
  });

  it('Should verify correct paswwrod', async () => {
    const plainPassword = 'password';
    const hashedPassword = 'hashed_password';

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.verify(plainPassword, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    expect(result).toBe(true);
  });

  it('Should fail on incorrect password', async () => {
    const plainPassword = 'password';
    const hashedPassword = 'hashed_password';

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await service.verify(plainPassword, hashedPassword);

    expect(result).toBe(false);
  });
});
