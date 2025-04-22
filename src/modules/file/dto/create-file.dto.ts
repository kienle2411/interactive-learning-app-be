import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
