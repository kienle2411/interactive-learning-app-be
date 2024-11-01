import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(createSessionDto: CreateSessionDto) {
    return this.prisma.session.create({
      data: {
        ...createSessionDto,
      },
    });
  }

  async getSessionInformation(sessionId: string) {
    return this.prisma.session.findUnique({
      where: { id: sessionId },
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
        updatedAt: new Date(),
      },
    });
  }

  async getAllSessionByClassroomId(
    classroomId: string,
    page: number = 1,
    limit: number = 0,
    skip: number = 0,
  ) {
    const sessions = await this.prisma.session.findMany({
      where: { classroomId },
      ...(limit > 0 ? { skip, take: limit } : {}),
      orderBy: { createdAt: 'asc' },
    });

    const totalSession = await this.prisma.session.count({
      where: { classroomId },
    });

    const lastPage = Math.ceil(totalSession / limit);
    if (page > lastPage) {
      throw new BadRequestException(
        `Page ${page} does not exist. Total pages: ${lastPage}`,
      );
    }

    return {
      data: sessions,
      total: totalSession,
      page,
      lastPage: lastPage,
    };
  }
}
