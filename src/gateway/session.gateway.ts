import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
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
  private logger: Logger = new Logger('SessionGateway');

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
    @MessageBody() data: { sessionId: string; userId: string },
  ): WsResponse<string> {
    const response = `User ${data.userId} joined session ${data.sessionId}`;
    return { event: 'sessionJoined', data: response };
  }

  @SubscribeMessage('leaveSession')
  handleLeaveSession(
    @MessageBody() data: { sessionId: string; userId: string },
  ): WsResponse<string> {
    const response = `User ${data.userId} left session ${data.sessionId}`;
    return { event: 'sessionLeft', data: response };
  }
}
