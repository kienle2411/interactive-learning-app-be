import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/password/password.service';
import { UsersService } from 'src/users/users.service';
import { JWT_SECRET_KEY } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && this.passwordService.comparePassword(user.password, pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
