import { Module } from '@nestjs/common';
import { StudentInClassroomService } from './student-in-classroom.service';
import { StudentInClassroomController } from './student-in-classroom.controller';

@Module({
  providers: [StudentInClassroomService],
  controllers: [StudentInClassroomController]
})
export class StudentInClassroomModule {}
