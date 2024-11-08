import { IsNotEmpty, IsString } from 'class-validator';

export class deleteStudentFromClassroomDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  classroomId: string;
}
