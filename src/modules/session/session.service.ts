import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PaginationHelper } from '@/common/helpers';
import { FileService } from '../file/file.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async createSession(
    classroomId: string,
    userId: string,
    createSessionDto: CreateSessionDto,
    file: Express.Multer.File,
  ) {
    const uploadedFile = await this.fileService.createFile(file, userId);
    return await this.prisma.session.create({
      data: {
        ...createSessionDto,
        classroomId,
        createdBy: userId,
        fileId: uploadedFile.id,
      },
    });
  }

  async getSessionInformation(sessionId: string) {
    return this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        file: {
          include: {
            slidePage: true,
          },
        },
      },
    });
  }

  async updateSessionInformation(
    sessionId: string,
    updateSessionDto: UpdateSessionDto,
  ) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        ...updateSessionDto,
      },
    });
  }

  async deleteSession(sessionId: string) {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
