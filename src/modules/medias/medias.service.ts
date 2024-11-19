import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';

@Injectable()
export class MediasService {
  constructor(private readonly prisma: PrismaService) {}

  async createMedia(createMediaDto: CreateMediaDto) {
    return this.prisma.media.create({
      data: {
        ...createMediaDto,
      },
    });
  }
}
