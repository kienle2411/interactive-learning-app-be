import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { PaginationHelper, PaginationParams } from '@/common/helpers';
import { Request } from 'express';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('classrooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  async getStudentClassrooms(
    @Req() req: Request,
    @Query() pag: PaginationParams,
  ) {
    const { page, limit } = pag;
    return await this.studentsService.getStudentClassrooms(
      req.user['sub'],
      page,
      limit,
    );
  }
}
