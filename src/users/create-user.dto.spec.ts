import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { error } from 'console';

describe('CreateUserDto', () => {
  let dto = new CreateUserDto();

  beforeEach(() => {
    dto.email = 'test@gmail.com';
    dto.name = 'John';
    dto.password = '12345678Aa!';
  });

  it('Should validate complete valid data', async () => {
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('Should fail on invalid email', async () => {
    dto.email = 'test@';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('Should return specific validation error', async () => {
    dto.password = 'abcdef';

    const erros = await validate(dto);

    const passwordError = erros.find((error) => error.property === 'password');

    expect(passwordError).not.toBeUndefined();

    const messages = Object.values(passwordError?.constraints ?? {});

    expect(messages).toContain(
      'Password must contain at least 1 uppercase letter',
    );
  });
});
