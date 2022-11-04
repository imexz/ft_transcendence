import User from "./user";

export default class Message {
    constructor(message: any, user: User) {

        console.warn("constructor for message called", message);
        this._id = message._id
        this.content = message.content
        this.avatar = user.avatar_url
        this.content = message.content
        this.senderId = message.senderId.toString()
        this.timestamp = message.timestamp
        this.username = user.username
    }

    _id: number
    avatar: string
    content: string
    senderId: string
    timestamp: string
    username: string

}