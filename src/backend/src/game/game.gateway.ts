import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';


@WebSocketGateway({
  cors: {
    origin: '*',
  }, namespace: 'game' 
}) //not shure
export class GameGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('positon')
  handleMessage(
    @MessageBody("position") position: number, 
    @ConnectedSocket() client:Socket): string {
    return 'Hello world!';
  }
}
