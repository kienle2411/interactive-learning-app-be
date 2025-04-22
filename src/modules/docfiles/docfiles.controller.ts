// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Post,
//   Req,
//   Res,
//   SetMetadata,
//   StreamableFile,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { DocfilesService } from './docfiles.service';
// import { DropboxService } from '../dropbox/dropbox.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import moment from 'moment';
// import { PrismaService } from '@/prisma.service';
// import { CreateDocFileDto } from './dto/create-docfile.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { createReadStream } from 'fs';
// import { ApiBearerAuth } from '@nestjs/swagger';
// import path from 'path';
// import { diskStorage } from 'multer';
// import * as fs from 'fs';

// @ApiBearerAuth()
// @Controller('docfiles')
// export class DocfilesController {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly docFilesService: DocfilesService,
//     private readonly dropboxService: DropboxService,
//   ) {}

//   // @Post('upload')
//   // @UseInterceptors(FileInterceptor('file'))
//   // @UseGuards(JwtAuthGuard)
//   // async uploadDocFile(
//   //   @Req() req: Request,
//   //   @UploadedFile('file') file: Express.Multer.File,
//   // ) {
//   //   const convertExtensions = ['.pptx', '.ppt'];
//   //   const fileExtension = path.extname(file.originalname).toLocaleLowerCase();
//   //   if (convertExtensions.includes(fileExtension)) {
//   //     const uploaded = await this.docFilesService.convertPPTXtoPNG(file);
//   //     return this.dropboxService.uploadFile(
//   //       file,
//   //       req.user['sub'],
//   //       uploaded.slides,
//   //     );
//   //   }
//   //   return this.dropboxService.uploadFile(file, req.user['sub']);
//   // }

//   @Get(':id/download')
//   @SetMetadata('skipProvider', true)
//   async downloadDocFile(
//     @Param('id') docFileId: string,
//     @Res({ passthrough: true }) res: Response,
//   ) {
//     const link = await this.dropboxService.downloadFile(docFileId);
//     return res.redirect(link);
//   }

//   // @Get(':id')
//   // @UseGuards(JwtAuthGuard)
//   // async getDocFileDetails(@Param('id') docFileId: string) {
//   //   return await this.docFilesService.getDocFileDetails(docFileId);
//   // }
// }
