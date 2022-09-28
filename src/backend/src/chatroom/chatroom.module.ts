import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatroomController } from "./chatroom.controller";
import { chatroom } from "./chatroom.entity";
import { ChatroomService } from "./chatroom.service";

@Module({
    imports: [TypeOrmModule.forFeature([chatroom])],
    controllers: [ChatroomController],
    providers: [ChatroomService],
    exports: [TypeOrmModule, ChatroomService]

})
export class ChatroomModule {}