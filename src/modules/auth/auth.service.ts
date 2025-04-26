import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/modules/password/password.service';
import { UserService } from '@/modules/user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { EmailService } from '../email/email.service';
import { MailgunService } from 'nestjs-mailgun';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}
  async signUp(createUserDto: CreateUserDto) {
    const hashedPassword = await this.passwordService.hashPassword(
      createUserDto.password,
    );
    const newUser = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    const tokens = await this.getTokens(
      newUser.id,
      newUser.username,
      newUser.role,
    );
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    await this.emailService.sendWelcomeEmail(
      createUserDto.email,
      createUserDto.firstName,
    );
    return tokens;
  }

  async signIn(authDto: AuthDto) {
    const user = await this.userService.findByUsername(authDto.username);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await this.passwordService.comparePassword(
      authDto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.id, user.username, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: null });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(userId: string, username: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.configService.get<string>('JWT'),
          expiresIn: '30m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
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
    const user = await this.userService.findById(userId);
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
    const tokens = await this.getTokens(user.id, user.username, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const resetToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: this.configService.get<string>('JWT_RESET'),
        expiresIn: '1h',
      },
    );
    return await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, password: string) {
    const decodedToken = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_RESET'),
    });
    const userId = decodedToken.sub;
    if (!userId) {
      throw new BadRequestException('Invalid or expired token');
    }
    const user = await this.userService.findById(userId);
    const hashedPassword = await this.passwordService.hashPassword(password);
    return await this.userService.update(userId, { password: hashedPassword });
  }
}
