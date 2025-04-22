import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
