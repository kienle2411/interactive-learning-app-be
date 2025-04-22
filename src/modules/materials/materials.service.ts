import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { DropboxService } from '../dropbox/dropbox.service';
import { FileService } from '../file/file.service';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async createMaterial(
    userId: string,
    classroomId: string,
    createMaterialDto: CreateMaterialDto,
    file?: Express.Multer.File,
  ) {
    const material = await this.prisma.material.create({
      data: {
        ...createMaterialDto,
        classroomId,
        createdBy: userId,
      },
    });
    if (file) {
      await this.fileService.createFile(file, userId, material.id);
      return material;
    }
    return material;
  }

  async getMaterialInformation(materialId: string) {
    return await this.prisma.material.findUnique({
      where: { id: materialId },
    });
  }

  async updateMaterialInformation(
    materialId: string,
    updateMaterialDto: UpdateMaterialDto,
  ) {
    return await this.prisma.material.update({
      data: {
        ...updateMaterialDto,
      },
      where: { id: materialId },
    });
  }
}
