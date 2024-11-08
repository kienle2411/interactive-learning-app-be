import { Injectable } from '@nestjs/common';
import { Dropbox, DropboxAuth, files } from 'dropbox';
import * as fs from 'fs';
import * as path from 'path';
import moment from 'moment';
import { PrismaService } from '@/prisma.service';
import { DocType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

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

  async uploadFile(filePath: string, userId: string): Promise<any> {
    try {
      const dropboxPath = `/docFiles/${userId}/${moment().format('yyyy-MM-dd_HH-mm-ss')}-${path.basename(filePath)}`;
      const fileContents = fs.readFileSync(filePath);
      const response = await this.dbx.filesUpload({
        path: dropboxPath,
        contents: fileContents,
      });
      await this.prisma.docFile.create({
        data: {
          type: DocType.TXT,
          url: dropboxPath,
        },
      });
      return response;
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
          url: true,
        },
      });
      const response = await this.dbx.filesDownload({
        path: dropboxPath.url,
      });
      return response;
    } catch (error) {
      console.error('Error downloading file to Dropbox: ', error);
      throw error;
    }
  }
}
