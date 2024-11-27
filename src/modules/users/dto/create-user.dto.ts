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
  Length,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @IsString({ message: 'Username must be a string' })
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message:
      'Username can only contain letters, numbers, underscores and hyphens',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 24)
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
