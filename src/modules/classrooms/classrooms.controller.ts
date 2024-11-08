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
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { UpdateClassroomDto } from './dto/update-classroom-dto';
import { SessionsService } from 'src/modules/sessions/sessions.service';
import { PaginationParams } from '@/common/helpers';
import { CreateMaterialDto } from '../materials/dto/create-material.dto';

@Controller('classrooms')
export class ClassroomsController {
  constructor(
    private readonly classroomsService: ClassroomsService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Get(':id/students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async getClassroomStudents(
    @Param('id') classroomId: string,
    @Req() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomsService.getClassroomStudents(
      classroomId,
      page,
      limit,
    );
  }

  @Get(':id/groups')
  @UseGuards(JwtAuthGuard)
  async getClassroomGroups(
    @Param('id') classroomId: string,
    @Req() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomsService.getClassroomGroups(
      classroomId,
      page,
      limit,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async getClassroomInformation(@Param('id') classroomId: string) {
    return await this.classroomsService.getClassroomInformation(classroomId);
  }

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

  @Get(':id/materials')
  @UseGuards(JwtAuthGuard)
  async getClassroomMaterials(
    @Param('id') classroomId: string,
    @Body() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomsService.getClassroomMaterials(
      classroomId,
      page,
      limit,
    );
  }

  @Post(':id/materials')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async createClassroomMaterial(
    @Param('id') classroomId: string,
    @Body() createMaterialDto: CreateMaterialDto,
  ) {}

  @Get(':id/assignments')
  @UseGuards(JwtAuthGuard)
  async getClassroomAssignments(
    @Param('id') classroomId: string,
    @Body() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomsService.getClassroomAssignments(
      classroomId,
      page,
      limit,
    );
  }

  @Get(':id/sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async getClassroomSessions(
    @Param('id') classroomId: string,
    @Req() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.sessionsService.getClassroomSessions(
      classroomId,
      page,
      limit,
    );
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
}
