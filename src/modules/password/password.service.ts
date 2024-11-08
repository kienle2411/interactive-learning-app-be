import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  async hashPassword(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashPassword);
  }
}
