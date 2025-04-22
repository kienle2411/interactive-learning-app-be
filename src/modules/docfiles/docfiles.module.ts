// import { Module } from '@nestjs/common';
// import { DocfilesService } from './docfiles.service';
// import { DocfilesController } from './docfiles.controller';
// import { PrismaService } from '@/prisma.service';
// import { DropboxService } from '../dropbox/dropbox.service';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';
// import { MulterModule } from '@nestjs/platform-express';
// import { CloudinaryModule } from '../cloudinary/cloudinary.module';

// @Module({
//   providers: [
//     DocfilesService,
//     PrismaService,
//     DropboxService,
//     CloudinaryService,
//   ],
//   controllers: [DocfilesController],
//   imports: [
//     MulterModule.register({
//       dest: './uploads',
//       limits: { fileSize: 10 * 1024 * 1024 },
//     }),
//     CloudinaryModule,
//   ],
// })
// export class DocfilesModule {}
