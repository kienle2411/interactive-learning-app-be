import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/modules/password/password.service';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';
import { AuthDto } from './dto/auth.dto';
import { handlePrismaError } from '@/common/utils/prisma-error-handler';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(createUserDto: CreateUserDto) {
    // const userExists = await this.usersService.findByUsername(
    //   createUserDto.username,
    // );
    // if (userExists) {
    //   throw new BadRequestException('User already exists');
    // }
    const hashedPassword = await this.passwordService.hashPassword(
      createUserDto.password,
    );
    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    const tokens = await this.getTokens(
      newUser.id,
      newUser.username,
      newUser.roleId,
    );
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(authDto: AuthDto) {
    const user = await this.usersService.findByUsername(authDto.username);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await this.passwordService.comparePassword(
      authDto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.id, user.username, user.roleId);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(userId: string, username: string, roleId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          roleId,
        },
        {
          secret: this.configService.get<string>('JWT'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          roleId,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.username, user.roleId);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
