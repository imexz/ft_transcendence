import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { ChatroomController } from "./chatroom.controller";
import chatroom from "./chatroom.entity";
import { ChatroomService } from "./chatroom.service";

@Module({
    imports: [TypeOrmModule.forFeature([chatroom]), UsersModule, AuthModule],
    controllers: [ChatroomController],
    providers: [ChatroomService],
    exports: [TypeOrmModule, ChatroomService]

})
export class ChatroomModule {}