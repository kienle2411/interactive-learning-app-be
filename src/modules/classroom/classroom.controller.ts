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
import { ClassroomService } from './classroom.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { UpdateClassroomDto } from './dto/update-classroom-dto';
import { PaginationParams } from '@/common/helpers';
import { CreateMaterialDto } from '../material/dto/create-material.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAssignmentDto } from '../assignment/dto/create-assignment.dto';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { CreateSessionDto } from '../session/dto/create-session.dto';
import { Request } from 'express';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateMeetingDto } from '@/modules/meeting/dto/create-meeting.dto';
import { FileService } from '../file/file.service';

@ApiBearerAuth()
@Controller('classrooms')
@UseInterceptors(TransformInterceptor)
@UseFilters(GlobalExceptionFilter)
export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService,
    private readonly fileService: FileService,
  ) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async getClassroomInformation(@Param('id') classroomId: string) {
    return await this.classroomService.getClassroomInformation(classroomId);
  }

  @Get(':id/students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async getClassroomStudents(
    @Param('id') classroomId: string,
    @Query() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomService.getClassroomStudents(
      classroomId,
      page,
      limit,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async createClassroom(
    @Req() req: Request,
    @Body() createClassroomDto: CreateClassroomDto,
  ) {
    return await this.classroomService.createClassroom(
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
    await this.classroomService.updateClassroomInformation(
      classroomId,
      updateClassroomDto,
    );
    return { message: 'Classroom updated successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async deleteClassroom(@Param('id') classroomId: string) {
    await this.classroomService.deleteClassroom(classroomId);
    return { message: 'Classroom deleted successfully' };
  }

  @Get(':id/materials')
  @UseGuards(JwtAuthGuard)
  async getClassroomMaterials(
    @Param('id') classroomId: string,
    @Query() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomService.getClassroomMaterials(
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
    @UploadedFile('file') file?: Express.Multer.File,
  ) {
    return await this.classroomService.createClassroomMaterial(
      req.user.userId,
      classroomId,
      createMaterialDto,
      file,
    );
  }

  @Delete(':id/materials/:materialId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async deleteClassroomMaterial(
    @Param('id') classroomId: string,
    @Param('materialId') materialId: string,
  ) {
    return await this.classroomService.deleteClassroomMaterial(materialId);
  }

  @Get(':id/groups')
  @UseGuards(JwtAuthGuard)
  async getClassroomGroups(
    @Param('id') classroomId: string,
    @Query() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomService.getClassroomGroups(
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
    return await this.classroomService.createClassroomGroup(
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
    return await this.classroomService.getClassroomSessions(
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
    @Query() req: Request,
    @Body() createSessionDto: CreateSessionDto,
    @UploadedFile('file') file?: Express.Multer.File,
  ) {
    const uploadedFile = await this.fileService.createFile(
      file,
      req.user['sub'],
    );
    return await this.classroomService.createClassroomSession(
      classroomId,
      file,
      createSessionDto,
      req.user['sub'],
    );
  }

  @Get(':id/meetings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async getClassroomMeetings(
    @Param('id') classroomId: string,
    @Query() req: PaginationParams,
  ) {
    const { page, limit } = req;
    return await this.classroomService.getClassroomMeetings(
      classroomId,
      page,
      limit,
    );
  }

  @Post(':id/meetings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async createClassroomMeeting(
    @Param('id') classroomId: string,
    @Req() req: Request,
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    return await this.classroomService.createClassroomMeeting(
      classroomId,
      req.user['sub'],
      createMeetingDto,
    );
  }

  @Post('join')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  async joinClassroom(@Query() code: string, @Req() req: Request) {
    return await this.classroomService.joinClassroom(code, req.user['sub']);
  }

  @Delete('leave')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  async leaveClassroom(@Query() code: string, @Req() req: Request) {
    return await this.classroomService.leaveClassroom(code, req.user['sub']);
  }
}
