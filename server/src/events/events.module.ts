import { Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { GameService } from 'src/game/game.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [GameModule],
  providers: [EventsGateway, GameService]
})
export class EventsModule {}
