import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { throws } from 'assert';
import { Server, Socket } from 'socket.io';
import {
  AnswerPayload,
  IceCandidatePayload,
  MessagePayload,
  OfferPayload,
} from './meeting.interface';
import { JwtSocketMiddleware } from '@/common/middleware/jwt-socket.middleware';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  namespace: '/meeting',
  cors: {
    origin: '*',
  },
})
@Injectable()
export class MeetingGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(MeetingGateway.name);

  constructor(private readonly authService: AuthService) {}

  afterInit() {
    this.server.use(JwtSocketMiddleware(this.authService));
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinMeeting')
  async handleJoinMeeting(client: Socket, meetingId: string) {
    const room = `meeting_${meetingId}`;
    this.logger.log(`Client ${client.id} joined meeting: ${meetingId}`);
    client.join(room);
    client.broadcast.to(room).emit('userJoined', {
      id: client.id,
    });
    const clients = await this.server.in(room).fetchSockets();
    client.to(room).emit('userJoined', {
      id: client.id,
      currentClients: clients,
    });
    client.emit('meetingInfo', {
      currentClients: clients,
    });
  }

  @SubscribeMessage('offer')
  async handleOffer(client: Socket, payload: OfferPayload) {
    client.broadcast.to(`meeting_${payload.meetingId}`).emit('offer', {
      sender: client.id,
      offer: payload.offer,
    });
  }

  @SubscribeMessage('answer')
  async handleAnswer(client: Socket, payload: AnswerPayload) {
    client.broadcast.to(`meeting_${payload.meetingId}`).emit('answer', {
      sender: client.id,
      answer: payload.answer,
    });
  }

  @SubscribeMessage('iceCandidate')
  async handleIceCandidate(client: Socket, payload: IceCandidatePayload) {
    client.broadcast.to(`meeting_${payload.meetingId}`).emit('iceCandidate', {
      sender: client.id,
      candidate: payload.candidate,
    });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: MessagePayload) {
    this.logger.log(
      `Client ${client.id} sent message: ${payload.content} to meeting: ${payload.meetingId}`,
    );
    this.server.to(`meeting_${payload.meetingId}`).emit('receiveMessage', {
      senderId: payload.senderId,
      content: payload.content,
      timestamp: payload.timestamp,
    });
  }

  @SubscribeMessage('leaveMeeting')
  async leaveMeeting(client: Socket, meetingId: string) {
    const room = `meeting_${meetingId}`;
    client.leave(room);
    client.to(room).emit('userLeft', {
      id: client.id,
    });
  }
}
