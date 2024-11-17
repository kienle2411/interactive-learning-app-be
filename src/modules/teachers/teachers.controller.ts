import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { PaginationParams } from '@/common/helpers';
import { Request } from 'express';

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
