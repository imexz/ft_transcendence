import  User  from "./user";
import  Message  from "./message";

export enum Access {
    public,
    private,
    protected,
    dm,
}

export default class Room {
    constructor(name: string) {
        this.roomName = name
    }

    roomId: number
    roomName: string

    users: User[]

    messages: Message[]


}

