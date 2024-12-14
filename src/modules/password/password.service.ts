import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  async hashPassword(password: string) {
    return argon2.hash(password);
  }

  async comparePassword(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashPassword, plainPassword);
  }
}
