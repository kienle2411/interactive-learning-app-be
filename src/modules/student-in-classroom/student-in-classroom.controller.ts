import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentInClassroomService } from './student-in-classroom.service';
import { JwtAuthGuard } from '@/modules/auth/guard/jwt-auth.guard';
import { Roles } from '@/modules/auth/decorator/roles.decorator';
import { RolesGuard } from '@/modules/auth/guard/roles.guard';
import { CreateStudentInClassroomDto } from './dto/create-student-in-classroom.dto';
import { create } from 'domain';
import { AddStudentByEmailDto } from './dto/add-student-by-email.dto';
import { deleteStudentFromClassroomDto } from './dto/delete-student-from-classroom.dto';

@Controller('join-class')
export class StudentInClassroomController {
  constructor(
    private readonly studentInClassroomService: StudentInClassroomService,
  ) {}

  @Post(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async joinClassroom(@Req() req, @Param('id') classroomId: string) {
    await this.studentInClassroomService.joinClassroom(
      req.user.userId,
      classroomId,
    );
    return { message: 'Successfully joined the classroom!' };
  }

  @Post('email/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async addStudentToClassroom(
    @Param('id') classroomId: string,
    @Body() addStudentToClassroom: AddStudentByEmailDto,
  ) {
    await this.studentInClassroomService.addStudentToClassroomByEmail(
      classroomId,
      addStudentToClassroom.emails,
    );
    return {
      message: 'Successfully invited list student to classroom',
    };
  }
  // delete student from group and class
  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student')
  async deleteStudentFromClassroom(
    @Body() deleteStudentFromClassroomDto: deleteStudentFromClassroomDto,
  ) {
    await this.studentInClassroomService.deleteStudentFromClassroomByStudentId(
      deleteStudentFromClassroomDto.studentId,
      deleteStudentFromClassroomDto.classroomId,
    );
    return {
      message: 'Successfully deleted student from classroom',
    };
  }
}
