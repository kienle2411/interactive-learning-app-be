import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

  // Log when client connects
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinMeeting')
  async handleJoinMeeting(client: Socket, meetingId: string) {
    this.logger.log(`Client ${client.id} joined meeting: ${meetingId}`);
    client.join(`meeting_${meetingId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    data: { meetingId: string; message: string },
  ) {
    const { meetingId, message } = data;
    this.logger.log(
      `Client ${client.id} sent message: ${message} to meeting: ${meetingId}`,
    );
    this.server
      .to(`meeting_${meetingId}`)
      .emit('receiveMessage', { clientId: client.id, message });
  }
}
