import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationParams } from '@/common/helpers';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('classrooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async getTeacherClassrooms(
    @Req() req: Request,
    @Query() pag: PaginationParams,
  ) {
    const { page, limit } = pag;
    return this.teacherService.getTeacherClassrooms(
      req.user['sub'],
      page,
      limit,
    );
  }
}
