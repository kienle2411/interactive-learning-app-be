import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class AddStudentByEmailDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsEmail({}, { each: true })
  emails: string[];
}
