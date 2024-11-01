import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { ClassroomsService } from './classrooms.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateClassroomDto } from './dto/update-classroom-dto';
import { PaginationRequest } from 'src/interfaces/pagination-request.interface';
import { SessionsService } from 'src/sessions/sessions.service';

@Controller('classrooms')
export class ClassroomsController {
  constructor(
    private readonly classroomsService: ClassroomsService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async createClassroom(@Body() createClassroomDto: CreateClassroomDto) {
    await this.classroomsService.createClassroom(createClassroomDto);
    return { message: 'Classroom created successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async deleteClassroom(@Param('id') classroomId: string) {
    await this.classroomsService.deleteClass(classroomId);
    return { message: 'Classroom deleted successfully' };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async updateClassroomInformation(
    @Param('id') classroomId: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    await this.classroomsService.updateClassroomInformation(
      classroomId,
      updateClassroomDto,
    );
    return { message: 'Classroom updated successfully' };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async getClassroomInformation(@Param('id') classroomId: string) {
    return await this.classroomsService.getClassroomInformation(classroomId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async getAllClassroomByTeacher(
    @Request() req,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.classroomsService.getAllClassroomByTeacher(
      req.user.userId,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':id/sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async getSessionByClassroomId(
    @Param('id') classroomId: string,
    @Req() req: PaginationRequest,
  ) {
    const { page, limit } = req.pagination;
    return this.sessionsService.getAllSessionByClassroomId(
      classroomId,
      page,
      limit,
    );
  }
}
