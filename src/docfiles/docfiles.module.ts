import { Module } from '@nestjs/common';
import { DocfilesService } from './docfiles.service';
import { DocfilesController } from './docfiles.controller';

@Module({
  providers: [DocfilesService],
  controllers: [DocfilesController]
})
export class DocfilesModule {}
