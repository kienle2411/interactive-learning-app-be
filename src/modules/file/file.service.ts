import { DropboxService } from '@/modules/dropbox/dropbox.service';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dropboxService: DropboxService,
  ) {}

  async deleteMaterialFile(materialId: string) {
    return this.prisma.file.updateMany({
      where: { materialId: materialId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async createFile(
    file: Express.Multer.File,
    userId: string,
    materialId?: string,
  ) {
    const response = await this.dropboxService.uploadFile(file, userId);
    return this.prisma.file.create({
      data: {
        type: file.originalname.split('.')[1].toUpperCase(),
        name: file.originalname,
        uploadedBy: userId,
        url: response.result.path_lower,
        materialId: materialId,
      },
    });
  }

  async convertPPTXToPNG(userId: string, file: Express.Multer.File) {
    await this.createFile(file, userId);
  }
}
