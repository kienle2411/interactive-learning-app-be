import { IsNotEmpty, IsSemVer, IsString } from 'class-validator';

export class CreateStudentInGroupDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  groupId: string;

  @IsNotEmpty()
  @IsString()
  classroomId: string;
}
