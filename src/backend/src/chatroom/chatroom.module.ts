import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { banMute } from "./banMute/banMute.entity";
import { BanMuteService } from "./banMute/banMute.service";
import { ChatroomController } from "./chatroom.controller";
import chatroom from "./chatroom.entity";
import { ChatroomService } from "./chatroom.service";

@Module({
    imports: [TypeOrmModule.forFeature([chatroom, banMute]), UsersModule, AuthModule],
    controllers: [ChatroomController],
    providers: [ChatroomService, BanMuteService],
    exports: [TypeOrmModule, ChatroomService, BanMuteService]

})
export class ChatroomModule {}