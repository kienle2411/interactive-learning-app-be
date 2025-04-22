import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './sessions.controller';
import { PrismaService } from 'src/prisma.service';
import { FileService } from '../file/file.service';
import { DropboxService } from '../dropbox/dropbox.service';

@Module({
  providers: [SessionService, PrismaService, FileService, DropboxService],
  controllers: [SessionController],
})
export class SessionModule {}
