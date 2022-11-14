import User from "./user";

export default class Message {
    constructor(message: any, user?: User) {

        // console.warn("constructor for message called", message);
        if (user != undefined)
        {
            this.avatar = user.avatar_url
            this.username = user.username
        }
        else
        {
            this.avatar = message.avatar
            this.username = message.username
        }
        this._id = message._id
        this.content = message.content
        this.content = message.content
        this.senderId = message.senderId.toString()
        const ts : Date = message.timestamp
        this.timestamp = ts.toLocaleString()
    }

    _id: number
    avatar: string
    content: string
    senderId: string
    timestamp: string
    username: string

}