import { Injectable, Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuizService } from './quiz.service';
import { Answer, Question, QuestionType } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { JwtSocketMiddleware } from '@/common/middleware/jwt-socket.middleware';
import { SubmitAnswerPayload } from './quiz.interface';

@WebSocketGateway({
  namespace: '/quiz',
  cors: {
    origin: '*',
  },
})
@Injectable()
export class QuizGateway {
  constructor(
    private readonly quizService: QuizService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;
  private readonly logger = new Logger(QuizGateway.name);

  afterInit() {
    this.server.use(JwtSocketMiddleware(this.authService));
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('createQuizRoom')
  handleCreateQuizRoom(client: Socket, quizId: string) {
    client.join(`quiz_${quizId}`);
    this.logger.log(`Client ${client.id} started quiz: ${quizId}`);
  }

  @SubscribeMessage('startQuiz')
  async handleStartQuiz(client: Socket, quizId: string) {
    const questions = await this.quizService.getQuizQuestions(quizId);
    let currentQuestionIndex = 0;
    const sendNextQuestion = () => {
      if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex].question;
        const startAt = new Date();
        this.server.to('quiz_' + quizId).emit('receiveQuestion', {
          question: question,
          startAt: startAt,
        });

        setTimeout(() => {
          currentQuestionIndex++;
          sendNextQuestion();
        }, question.timeLimit * 1000);
      } else {
        this.server.to('quiz_' + quizId).emit('quizEnded', {
          message: 'Quiz has ended',
        });
      }
    };
    sendNextQuestion();
  }

  @SubscribeMessage('joinQuiz')
  handleJoinQuiz(client: Socket, quizId: string) {
    client.join(`quiz_${quizId}`);
    this.logger.log(`Client ${client.id} joined quiz: ${quizId}`);
  }

  @SubscribeMessage('submitAnswer')
  handleSubmitAnswer(client: Socket, payload: SubmitAnswerPayload) {
    this.logger.log(
      `Client ${client.id} submitted answer for question ${payload.questionId}: ${payload.answer}`,
    );
    this.server.to(`quiz_${payload.quizId}`).emit('receiveAnswer', {
      clientId: client.id,
      questionId: payload.questionId,
      answer: payload.answer,
    });
    this.sendLeaderboard(payload.quizId);
  }

  private sendLeaderboard(quizId: string) {
    this.quizService.getLeaderboard(quizId).then((leaderboard) => {
      this.server.to('quiz_' + quizId).emit('updateLeaderboard', leaderboard);
    });
  }
}
