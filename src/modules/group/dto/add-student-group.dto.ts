import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';

export class AddStudentGroupDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentEmailDto)
  students: StudentEmailDto[];
}

export class StudentEmailDto {
  @IsString()
  @IsEmail()
  email: string;
}
