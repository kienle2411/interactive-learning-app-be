import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class SessionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('SessionGateway');
  private sessions: {
    [key: string]: { students: Socket[]; teacher: Socket | null };
  } = {};
  private submittedAnswers: {
    [sessionId: string]: {
      studentId: string;
      questionId: string;
      response: string;
    }[];
  } = {};

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Initialized');
  }

  @SubscribeMessage('joinSession')
  handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; userId: string },
  ) {
    const room = data.sessionId;
    client.join(room);
    const response = `User ${data.userId} joined session ${data.sessionId}`;
    this.logger.log(response);
    this.server.to(room).emit('sessionJoined', response);
    return { event: 'sessionJoined', data: response };
  }

  @SubscribeMessage('leaveSession')
  handleLeaveSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; userId: string },
  ) {
    const room = data.sessionId;
    client.leave(room);
    const response = `User ${data.userId} left session ${data.sessionId}`;
    this.logger.log(response);
    this.server.to(room).emit('sessionLeft', response);
    return { event: 'sessionLeft', data: response };
  }

  @SubscribeMessage('sendSlide')
  handleSendSlide(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; slideUrl: string },
  ) {
    const room = data.sessionId;
    this.logger.log(
      `Slide sent to session ${data.sessionId}: ${data.slideUrl}`,
    );
    client.to(room).emit('receiveSlide', { slideUrl: data.slideUrl });
  }

  @SubscribeMessage('sendQuestion')
  handleSendQuestion(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { sessionId: string; question: any },
  ) {
    const room = data.sessionId;
    this.logger.log(`Question sent to session ${data.sessionId}`);
    client.to(room).emit('receiveQuestion', {
      question: data.question,
    });
  }

  @SubscribeMessage('submitAnswer')
  handleSubmitAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      sessionId: string;
      userId: string;
      questionId: string;
      response: string;
    },
  ) {
    const { sessionId, userId, questionId, response } = data;
    this.logger.log(
      `Received answer from ${userId} for question ${questionId}: ${response}`,
    );

    if (!this.submittedAnswers[sessionId]) {
      this.submittedAnswers[sessionId] = [];
    }
    this.submittedAnswers[sessionId].push({
      studentId: userId,
      questionId,
      response,
    });

    const session = this.sessions[sessionId];
    if (session && session.teacher) {
      session.teacher.emit(
        'updateSubmitList',
        this.submittedAnswers[sessionId],
      );
    }
  }
}
