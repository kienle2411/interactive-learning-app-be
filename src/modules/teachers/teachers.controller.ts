import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationParams } from '@/common/helpers';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get('classrooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async getTeacherClassrooms(
    @Req() req: Request,
    @Query() pag: PaginationParams,
  ) {
    const { page, limit } = pag;
    return this.teachersService.getTeacherClassrooms(
      req.user['sub'],
      page,
      limit,
    );
  }
}
