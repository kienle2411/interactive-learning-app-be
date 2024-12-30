import { BadRequestException, Injectable } from '@nestjs/common';
import { Dropbox, DropboxAuth, files } from 'dropbox';
import moment from 'moment';
import { PrismaService } from '@/prisma.service';
import { DocType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { isStringKeyInEnum } from '@/common/utils/includeEnum.util';
import { Readable } from 'stream';

@Injectable()
export class DropboxService {
  private dbx: Dropbox;
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const clientId = this.configService.get<string>('DROPBOX_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'DROPBOX_CLIENT_SECRET',
    );
    const refreshToken = this.configService.get<string>(
      'DROPBOX_REFRESH_TOKEN',
    );

    const dbxAuth = new DropboxAuth({
      clientId: clientId,
      clientSecret: clientSecret,
    });

    dbxAuth.setRefreshToken(refreshToken);

    this.dbx = new Dropbox({ auth: dbxAuth });
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    url?: string[],
  ): Promise<any> {
    try {
      const fileExtension = file.originalname.split('.')[1].toUpperCase();
      if (!isStringKeyInEnum(fileExtension, DocType)) {
        throw new BadRequestException('File type is not accepted!');
      }
      const dropboxPath = `/docFiles/${userId}/${moment().format('yyyy-MM-DD_HH-mm-ss')}-${file.originalname}`;
      const response = await this.dbx.filesUpload({
        path: dropboxPath,
        contents: file.buffer,
      });
      if (url) {
        const docFile = await this.prisma.docFile.create({
          data: {
            type: fileExtension as DocType,
            fileName: file.originalname,
            path: dropboxPath,
            url: url,
          },
        });
        return { docFile, response };
      } else {
        const docFile = await this.prisma.docFile.create({
          data: {
            type: fileExtension as DocType,
            fileName: file.originalname,
            path: dropboxPath,
          },
        });
        return { docFile, response };
      }
    } catch (error) {
      console.error('Error uploading file to Dropbox: ', error);
      throw error;
    }
  }

  async downloadFile(docFileId: string) {
    try {
      const dropboxPath = await this.prisma.docFile.findUnique({
        where: {
          id: docFileId,
        },
        select: {
          path: true,
        },
      });
      const response = await this.dbx.filesGetTemporaryLink({
        path: dropboxPath.path,
      });
      return response.result.link;
    } catch (error) {
      console.error('Error downloading file to Dropbox: ', error);
      throw error;
    }
  }
}
