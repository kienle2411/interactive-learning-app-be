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
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { ClassroomsService } from './classrooms.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { UpdateClassroomDto } from './dto/update-classroom-dto';
import { SessionsService } from 'src/modules/sessions/sessions.service';
import { PaginationParams } from '@/common/helpers';
import { CreateMaterialDto } from '../materials/dto/create-material.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAssignmentDto } from '../assignments/dto/create-assignment.dto';
import { CreateGroupDto } from '../groups/dto/create-group.dto';
import { CreateSessionDto } from '../sessions/dto/create-session.dto';
import { Request } from 'express';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';

@Controller('classrooms')
@UseInterceptors(TransformInterceptor)
@UseFilters(GlobalExceptionFilter)
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Get(':id/students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async getClassroomStudents(
    @Param('id') classroomId: string,
    @Query() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomsService.getClassroomStudents(
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
  async createClassroom(
    @Req() req: Request,
    @Body() createClassroomDto: CreateClassroomDto,
  ) {
    return await this.classroomsService.createClassroom(
      createClassroomDto,
      req.user['sub'],
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
    @Query() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomsService.getClassroomMaterials(
      classroomId,
      page,
      limit,
    );
  }

  @Post(':id/materials')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async createClassroomMaterial(
    @Param('id') classroomId: string,
    @Req() req,
    @Body() createMaterialDto: CreateMaterialDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.classroomsService.createClassroomMaterial(
      req.user.userId,
      classroomId,
      file,
      createMaterialDto,
    );
  }

  @Get(':id/assignments')
  @UseGuards(JwtAuthGuard)
  async getClassroomAssignments(
    @Param('id') classroomId: string,
    @Query() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomsService.getClassroomAssignments(
      classroomId,
      page,
      limit,
    );
  }

  @Post(':id/assignments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async createClassroomAssignment(
    @Param('id') classroomId: string,
    @Body() createAssignmentDto: CreateAssignmentDto,
  ) {
    return this.classroomsService.createClassroomAssignment(
      classroomId,
      createAssignmentDto,
    );
  }

  @Get(':id/groups')
  @UseGuards(JwtAuthGuard)
  async getClassroomGroups(
    @Param('id') classroomId: string,
    @Query() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomsService.getClassroomGroups(
      classroomId,
      page,
      limit,
    );
  }

  @Post(':id/groups')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async createClassroomGroup(
    @Param('id') classroomId: string,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return await this.classroomsService.createClassroomGroup(
      classroomId,
      createGroupDto,
    );
  }

  @Get(':id/sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async getClassroomSessions(
    @Param('id') classroomId: string,
    @Query() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomsService.getClassroomSessions(
      classroomId,
      page,
      limit,
    );
  }

  @Post(':id/sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async createClassroomSession(
    @Param('id') classroomId: string,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return await this.classroomsService.createClassroomSession(
      classroomId,
      createSessionDto,
    );
  }
}
