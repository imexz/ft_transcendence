import { Controller, Delete, Get, UseGuards, Request, Body, Post } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-two/jwt-auth.guard";
import { ChatroomService } from "./chatroom.service";

@Controller('chatroom')
export class ChatroomController {
    constructor(private readonly chatroomService: ChatroomService){}

    @Get('all')
	@UseGuards(JwtAuthGuard)
    async getAll(){
        return await this.chatroomService.getAll()
    }

    @Delete()
	@UseGuards(JwtAuthGuard)
    async deleteChatroom(@Request() req, @Body("room_name") room_name: string) {
        return await this.chatroomService.removeRoom(room_name, req.user)
    }

    @Post()
	@UseGuards(JwtAuthGuard)
    async CreatChatroon(@Request() req,
        @Body("room_name") room_name: string,
        @Body("access") access: string) {
        return await this.chatroomService.addRoom(room_name, access, req.user)
    }


}