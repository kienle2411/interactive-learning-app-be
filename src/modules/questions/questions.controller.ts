import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateChoiceDto } from '../choice/dto/create-choice.dto';
import { CreateAnswerDto } from '../answers/dto/create-answer.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionsService.createQuestion(createQuestionDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateQuestionInformation(
    @Param('id') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.questionsService.updateQuestionInformation(
      questionId,
      updateQuestionDto,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getQuestionInformation(@Param('id') questionId: string) {
    return await this.questionsService.getQuestionInformation(questionId);
  }

  @Post(':id/choices')
  @UseGuards(JwtAuthGuard)
  async createChoice(
    @Param('id') questionId: string,
    @Body() createChoiceDto: CreateChoiceDto,
  ) {
    return await this.questionsService.createQuestionChoice(
      questionId,
      createChoiceDto,
    );
  }

  @Post(':id/answers')
  @UseGuards(JwtAuthGuard)
  async createAnswer(
    @Param('id') questionId: string,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return await this.questionsService.createQuestionAnswer(
      questionId,
      createAnswerDto,
    );
  }
}
