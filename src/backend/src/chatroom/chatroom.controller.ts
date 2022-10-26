import { Controller, Delete, Get, UseGuards, Request, Body, Post, HttpException, HttpStatus } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-two/jwt-auth.guard";
import { Access } from "./chatroom.entity";
import { ChatroomService } from "./chatroom.service";

@Controller('chatroom')
export class ChatroomController {
    constructor(private readonly chatroomService: ChatroomService){}

    @Get('all')
	@UseGuards(JwtAuthGuard)
    async getAll(@Request() req){
        return await this.chatroomService.getAll(req.user)
    }

    @Delete()
	@UseGuards(JwtAuthGuard)
    async deleteChatroom(@Request() req, @Body("room_name") room_name: string) {
        return await this.chatroomService.removeRoom(room_name, req.user)
    }

    @Post('creat')//TB typo?
	@UseGuards(JwtAuthGuard)
    async CreatChatroon(@Request() req, //TB typo?
        @Body("room_name") room_name: string,
        @Body("access") access: Access,
        @Body("password") password: string)
    {
        console.log("password");
        console.log(password);

        if(await this.chatroomService.addRoom(room_name, access, req.user, password) == undefined)
            throw new HttpException('Forbidden', HttpStatus.CONFLICT);
        return this.getAll(req.user)
    }
}