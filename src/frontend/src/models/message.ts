import User from "./user";

export default class Message {
    constructor(message: any, user?: User) {

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
        let ts = new Date(message.timestamp)
        this.timestamp = ts.toLocaleString()
        // console.warn("constructor for message called", this);
        // if (message.system != undefined)
        //     this.system = message.system
        // else
        //     this.system = false
        if (message.senderId == null || message.senderId == -1)
        {
            this.system = true
            this.senderId = "System"
        }
        else
            this.senderId = message.senderId.toString()
    }

    _id: number
    avatar: string
    content: string
    senderId: string
    timestamp: string
    username: string
    system: boolean = false

}