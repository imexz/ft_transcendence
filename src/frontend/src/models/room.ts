import  User  from "./user";
import  Message  from "./message";

export default class Room {
    constructor(name: string) {
        this.roomName = name
    }

    roomId: number
    roomName: string

    users: User[]

    messages: Message[]


}

