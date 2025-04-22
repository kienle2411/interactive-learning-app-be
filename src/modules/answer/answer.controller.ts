import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UserService } from '../user/user.service';
import { Request } from 'express';

@Controller('answers')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly userService: UserService,
  ) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateAnswerInformation(
    @Param('id') answerId: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.answerService.updateAnswerInformation(
      answerId,
      updateAnswerDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteAnswer(@Param('id') answerId: string) {
    return this.answerService.deleteAnswer(answerId);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createAnswer(
    @Req() req: Request,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    const studentId = await this.userService.getStudentIdByUserId(
      req.user['sub'],
    );
    return this.answerService.createAnswer(studentId, createAnswerDto);
  }
}
