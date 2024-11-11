import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PaginationHelper } from '@/common/helpers';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

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
        deletedAt: new Date(),
      },
    });
  }
}
