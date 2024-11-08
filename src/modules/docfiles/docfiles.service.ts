import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateDocFileDto } from './dto/create-docfile.dto';

@Injectable()
export class DocfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async createDocFile(createDocFileDto: CreateDocFileDto) {
    return this.prisma.docFile.create({
      data: {
        ...createDocFileDto,
      },
    });
  }
}
