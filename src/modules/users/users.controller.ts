import {
  Body,
  Post,
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@/modules/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guard/roles.guard';
import { Roles } from '@/modules/auth/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.uploadAvatar(file, req.user['sub']);
  }
}
