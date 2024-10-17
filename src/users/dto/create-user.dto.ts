import { Gender } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  profileDescription?: string;

  @IsOptional()
  @IsString()
  mediaId?: string;

  @IsNotEmpty()
  @IsString()
  roleId: string;
}
