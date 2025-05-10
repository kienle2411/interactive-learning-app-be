import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { PrismaService } from '@/prisma.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async createQuiz(@Req() req: Request, @Body() createQuizDto: CreateQuizDto) {
    const teacherId = await this.userService.getTeacherIdByUserId(
      req.user['sub'],
    );
    return await this.quizService.createQuiz(teacherId, createQuizDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async updateQuizInformation(
    @Param('id') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return await this.quizService.updateQuizInformation(quizId, updateQuizDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getQuizInformation(@Param('id') quizId: string) {
    return await this.quizService.getQuizInformation(quizId);
  }

  @Get(':id/questions')
  @UseGuards(JwtAuthGuard)
  async getQuizQuestions(@Param('id') quizId: string) {
    return await this.quizService.getQuizQuestions(quizId);
  }

  @Post(':id/attempt')
  @UseGuards(JwtAuthGuard)
  async attemptQuiz(@Param('id') quizId: string, @Req() req: Request) {
    const studentId = await this.userService.getStudentIdByUserId(
      req.user['sub'],
    );
    return await this.quizService.attemptQuiz(quizId, studentId);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  async submitQuiz(@Param('id') quizAttemptId: string) {
    return await this.quizService.submitQuiz(quizAttemptId);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  async leaveQuiz(@Param('id') quizId: string, @Req() req: Request) {
    const studentId = await this.userService.getStudentIdByUserId(
      req.user['sub'],
    );
    return await this.quizService.leaveQuiz(quizId, studentId);
  }
}
