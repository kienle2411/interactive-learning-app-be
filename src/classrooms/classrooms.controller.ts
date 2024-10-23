import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { ClassroomsService } from './classrooms.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async createClassroom(@Body() createClassroomDto: CreateClassroomDto) {
    await this.classroomsService.createClassroom(createClassroomDto);
    return { message: 'Classroom created successfully' };
  }
}
