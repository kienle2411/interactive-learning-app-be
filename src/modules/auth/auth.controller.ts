import { Controller, Post, UseGuards, Get, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Public } from './decorator/public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }
}
