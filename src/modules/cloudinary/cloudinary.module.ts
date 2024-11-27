import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { Cloudinary, CloudinaryProvider } from './cloudinary/cloudinary';
import { StudentsService } from '@/modules/students/students.service';

@Module({
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
