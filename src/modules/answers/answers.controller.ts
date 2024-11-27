import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateAnswerInformation(
    @Param('id') answerId: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.answersService.updateAnswerInformation(
      answerId,
      updateAnswerDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteAnswer(@Param('id') answerId: string) {
    return this.answersService.deleteAnswer(answerId);
  }
}
