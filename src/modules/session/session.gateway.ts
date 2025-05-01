import { Injectable, Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

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
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
