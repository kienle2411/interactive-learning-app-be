import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateAnswerDto } from '../answer/dto/create-answer.dto';
import { CreateQuestionOptionDto } from './dto/create-question-option.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class QuestionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createQuestion(userId: string, createQuestionDto: CreateQuestionDto) {
    const teacherId = await this.userService.getTeacherIdByUserId(userId);
    const { linkedId, linkedType, ...questionData } = createQuestionDto;
    const question = await this.prisma.question.create({
      data: {
        ...questionData,
        teacherId: teacherId,
      },
    });
    await this.prisma.questionLink.create({
      data: {
        questionId: question.id,
        linkedId: linkedId,
        linkedType: linkedType,
      },
    });
    return question;
  }

  async updateQuestionInformation(
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.prisma.question.update({
      data: {
        ...updateQuestionDto,
      },
      where: { id: questionId },
    });
  }

  async getQuestionInformation(questionId: string) {
    return this.prisma.question.findUnique({
      where: { id: questionId },
    });
  }

  async createQuestionOption(
    questionId: string,
    createQuestionOptionDto: CreateQuestionOptionDto,
  ) {
    return this.prisma.questionOption.create({
      data: {
        ...createQuestionOptionDto,
        questionId: questionId,
      },
    });
  }

  async createQuestionAnswer(
    questionId: string,
    createAnswerDto: CreateAnswerDto,
  ) {
    return this.prisma.answer.create({
      data: {
        ...createAnswerDto,
        questionId: questionId,
      },
    });
  }

  async deleteQuestion(questionId: string) {
    await this.prisma.questionOption.updateMany({
      where: { questionId: questionId },
      data: { deletedAt: new Date() },
    });
    await this.prisma.answer.updateMany({
      where: { questionId: questionId },
      data: { deletedAt: new Date() },
    });
    await this.prisma.questionEssay.updateMany({
      where: { questionId: questionId },
      data: { deletedAt: new Date() },
    });
    await this.prisma.questionLink.updateMany({
      where: { questionId: questionId },
      data: { deletedAt: new Date() },
    });
    return this.prisma.question.update({
      where: { id: questionId },
      data: { deletedAt: new Date() },
    });
  }
}
