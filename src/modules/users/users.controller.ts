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
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@/modules/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guard/roles.guard';
import { Roles } from '@/modules/auth/decorator/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Get()
  @Roles('teacher')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
