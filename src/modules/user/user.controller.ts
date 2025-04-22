import {
  Body,
  Post,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = await this.userService.findById(req.user['sub']);
    if (user) {
      delete user.password;
      delete user.refreshToken;
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(req.user['sub'], updateUserDto);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.uploadAvatar(file, req.user['sub']);
  }
}
