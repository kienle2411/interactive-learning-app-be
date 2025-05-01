import { Injectable, Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuizService } from './quiz.service';
import { Answer, Question, QuestionType } from '@prisma/client';

@WebSocketGateway({
  namespace: '/quiz',
  cors: {
    origin: '*',
  },
})
@Injectable()
export class QuizGateway {
  constructor(private readonly quizService: QuizService) {}

  @WebSocketServer() server: Server;
  private readonly logger = new Logger(QuizGateway.name);

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

  @SubscribeMessage('receiveQuestion')
  handleReceiveQuestion(
    client: Socket,
    data: { question: Question; startAt: Date },
  ) {
    this.logger.log(`Client ${client.id} received question: ${data.question}`);
  }

  @SubscribeMessage('submitAnswer')
  handleSubmitAnswer(
    client: Socket,
    data: { quizId: string; questionId: string; answer: Answer },
  ) {
    this.logger.log(
      `Client ${client.id} submitted answer for question ${data.questionId}: ${data.answer}`,
    );
    this.server.to(`quiz_${data.quizId}`).emit('receiveAnswer', {
      clientId: client.id,
      questionId: data.questionId,
      answer: data.answer,
    });
  }
}
