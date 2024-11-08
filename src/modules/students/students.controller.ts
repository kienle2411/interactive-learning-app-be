import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { PaginationHelper, PaginationParams } from '@/common/helpers';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('classrooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  async getStudentClassrooms(@Request() req, @Req() pag: PaginationParams) {
    const { page, limit } = pag;
    return await this.studentsService.getStudentClassrooms(
      req.user.userId,
      page,
      limit,
    );
  }
}
