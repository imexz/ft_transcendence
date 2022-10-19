import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { hostURL } from 'src/hostURL';


@WebSocketGateway({
    cors: {
      // origin: "*",
      origin: [hostURL + ':8080', hostURL + ':3000'],
      credentials: true
    }
})

export class AppGateway {



}