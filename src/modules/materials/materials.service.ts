import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMaterialInformation(materialId: string) {
    return this.prisma.material.findUnique({
      where: { id: materialId },
    });
  }

  async updateMaterialInformation(
    materialId: string,
    updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.prisma.material.update({
      data: {
        ...updateMaterialDto,
      },
      where: { id: materialId },
    });
  }
}
