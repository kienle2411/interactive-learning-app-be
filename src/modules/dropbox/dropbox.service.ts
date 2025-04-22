import { BadRequestException, Injectable } from '@nestjs/common';
import { Dropbox, DropboxAuth, files } from 'dropbox';
import moment from 'moment';
import { PrismaService } from '@/prisma.service';
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

  async uploadFile(file: Express.Multer.File, userId: string): Promise<any> {
    try {
      const dropboxPath = `/files/${userId}/${moment().format('yyyy-MM-DD_HH-mm-ss')}-${file.originalname}`;
      const response = await this.dbx.filesUpload({
        path: dropboxPath,
        contents: file.buffer,
      });
      return { response };
    } catch (error) {
      console.error('Error uploading file to Dropbox: ', error);
      throw error;
    }
  }

  async downloadFile(fileId: string) {
    try {
      const dropboxPath = await this.prisma.file.findUnique({
        where: {
          id: fileId,
        },
        select: {
          url: true,
        },
      });
      const response = await this.dbx.filesGetTemporaryLink({
        path: dropboxPath.url,
      });
      return response.result.link;
    } catch (error) {
      console.error('Error downloading file to Dropbox: ', error);
      throw error;
    }
  }
}
