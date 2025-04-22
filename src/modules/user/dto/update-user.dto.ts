import { Gender } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  profileDescription?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}
