import { Injectable } from '@nestjs/common';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PrismaService } from '@/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class AnswerService {
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

  async createAnswer(studentId: string, createAnswerDto: CreateAnswerDto) {
    return this.prisma.answer.create({
      data: {
        ...createAnswerDto,
        createdBy: studentId,
      },
    });
  }
}
