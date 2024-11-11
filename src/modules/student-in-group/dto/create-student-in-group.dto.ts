import {
  IsArray,
  IsNotEmpty,
  IsSemVer,
  IsString,
  ValidateNested,
} from 'class-validator';

export class StudentIdDto {
  @IsNotEmpty()
  id: string;
}

export class CreateStudentInGroupDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  studentIds: string[];

  // @IsNotEmpty()
  // @IsString()
  // groupId: string;
}
