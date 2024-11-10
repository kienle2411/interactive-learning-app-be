import {
  Controller,
  Get,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PaginationParams } from '@/common/helpers';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get('classrooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async getTeacherClassrooms(@Request() req, @Query() pag: PaginationParams) {
    const { page, limit } = pag;
    return this.teachersService.getTeacherClassrooms(
      req.user.userId,
      page,
      limit,
    );
  }
}
