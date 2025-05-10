import { Injectable, Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { JwtSocketMiddleware } from '@/common/middleware/jwt-socket.middleware';
import { Socket } from 'socket.io';
import { QuestionPayload, SlidePayload } from './session.interface';

@WebSocketGateway({
  namespace: '/session',
  cors: {
    origin: '*',
  },
})
@Injectable()
export class SessionGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(SessionGateway.name);

  constructor(private readonly authService: AuthService) {}

  afterInit() {
    this.server.use(JwtSocketMiddleware(this.authService));
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinSession')
  handleJoinSession(client: Socket, sessionId: string) {
    const room = `session_${sessionId}`;
    this.logger.log(`Client ${client.id} joined session: ${sessionId}`);
    client.join(room);
    client.broadcast.to(room).emit('userJoined', {
      id: client.id,
    });
    const clients = this.server.sockets.adapter.rooms.get(room);
    client.to(room).emit('userJoined', {
      id: client.id,
      currentClients: clients,
    });
    client.emit('sessionInfo', {
      currentClients: clients,
    });
  }

  @SubscribeMessage('leaveSession')
  handleLeaveSession(client: Socket, sessionId: string) {
    const room = `session_${sessionId}`;
    this.logger.log(`Client ${client.id} left session: ${sessionId}`);
    client.leave(room);
    client.broadcast.to(room).emit('userLeft', {
      id: client.id,
    });
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    client: Socket,
    { sessionId, message }: { sessionId: string; message: string },
  ) {
    const room = `session_${sessionId}`;
    this.logger.log(`Client ${client.id} sent message: ${message}`);
    client.broadcast.to(room).emit('receiveMessage', {
      id: client.id,
      message,
    });
  }

  @SubscribeMessage('sendSlide')
  handleSendSlide(client: Socket, payload: SlidePayload) {
    const room = `session_${payload.sessionId}`;
    client.broadcast.to(room).emit('revceiveSlide', {
      slideUrl: payload.slideUrl,
    });
  }

  @SubscribeMessage('sendQuestion')
  handleSendQuestion(client: Socket, payload: QuestionPayload) {
    const room = `session_${payload.sessionId}`;
    client.broadcast.to(room).emit('receiveQuestion', {
      questionId: payload.questionId,
    });
  }
}
