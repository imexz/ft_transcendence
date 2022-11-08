import { Controller, Delete, Get, UseGuards, Request, Body, Post, HttpException, HttpStatus, UseInterceptors, ClassSerializerInterceptor} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-two/jwt-auth.guard";
import User from "src/users/entitys/user.entity";
import { Access } from "./chatroom.entity";
import { ChatroomService } from "./chatroom.service";

@Controller('chatroom')
export class ChatroomController {
    constructor(private readonly chatroomService: ChatroomService){}

    @Get('all')
    @UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(JwtAuthGuard)
    async getAll(@Request() req){
        // console.log("all");
        // console.log(req.user);
        // console.log("all1");
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
        // console.log("password");
        // console.log(password);
        console.log("new room: ", /* req,  */room_name, access);

        if(await this.chatroomService.addRoom(room_name, access, req.user, password) == undefined)
            throw new HttpException('Forbidden', HttpStatus.CONFLICT);
        // console.log("creat");
        // console.log(req.user);

        return await this.chatroomService.getAll(req.user)
    }

}