import { Injectable } from '@nestjs/common';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class AnswersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateAnswerInformation(
    answerId: string,
    updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.prisma.answer.update({
      data: {
        ...updateAnswerDto,
      },
      where: { id: answerId },
    });
  }

  async deleteAnswer(answerId: string) {
    return this.prisma.answer.update({
      where: { id: answerId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
