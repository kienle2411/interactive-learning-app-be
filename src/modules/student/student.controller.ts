import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { StudentService } from './students.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { PaginationHelper, PaginationParams } from '@/common/helpers';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('classrooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  async getStudentClassrooms(
    @Req() req: Request,
    @Query() pag: PaginationParams,
  ) {
    const { page, limit } = pag;
    return await this.studentService.getStudentClassrooms(
      req.user['sub'],
      page,
      limit,
    );
  }
}
