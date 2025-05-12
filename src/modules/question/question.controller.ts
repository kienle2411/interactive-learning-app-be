import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateAnswerDto } from '../answer/dto/create-answer.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateQuestionOptionDto } from './dto/create-question-option.dto';
import { create } from 'domain';
import { UpdateQuestionOptionDto } from './dto/update-question-option.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiBearerAuth()
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @Req() req: Request,
  ) {
    return await this.questionService.createQuestion(
      req.user['sub'],
      createQuestionDto,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateQuestionInformation(
    @Param('id') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.questionService.updateQuestionInformation(
      questionId,
      updateQuestionDto,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getQuestionInformation(@Param('id') questionId: string) {
    return await this.questionService.getQuestionInformation(questionId);
  }

  @Post(':id/options')
  @UseGuards(JwtAuthGuard)
  async createChoice(
    @Param('id') questionId: string,
    @Body() createQuestionOptionDto: CreateQuestionOptionDto,
  ) {
    return await this.questionService.createQuestionOption(
      questionId,
      createQuestionOptionDto,
    );
  }

  @Patch(':id/options/:optionId')
  @UseGuards(JwtAuthGuard)
  async updateChoice(
    @Param('optionId') optionId: string,
    @Body() updateQuestionDto: UpdateQuestionOptionDto,
  ) {
    return await this.questionService.updateQuestionOption(
      optionId,
      updateQuestionDto,
    );
  }

  @Delete(':id/options/:optionId')
  @UseGuards(JwtAuthGuard)
  @Roles('teacher')
  async deleteChoice(@Param('optionId') optionId: string) {
    return await this.questionService.deleteQuestionOption(optionId);
  }

  @Post(':id/answers')
  @UseGuards(JwtAuthGuard)
  async createAnswer(
    @Param('id') questionId: string,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return await this.questionService.createQuestionAnswer(
      questionId,
      createAnswerDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteQuestion(@Param('id') questionId: string) {
    return await this.questionService.deleteQuestion(questionId);
  }
}
