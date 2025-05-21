import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './sessions.controller';
import { PrismaService } from 'src/prisma.service';
import { FileService } from '../file/file.service';
import { DropboxService } from '../dropbox/dropbox.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  providers: [
    SessionService,
    PrismaService,
    FileService,
    DropboxService,
    CloudinaryService,
  ],
  controllers: [SessionController],
})
export class SessionModule {}
