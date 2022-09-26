import User from "./user";

export default class Message {
    constructor(content: string, user: User) {

        console.log("construct messig");
        
        this.content = content
        this.user = user
    }

    content: string;
    user: User ;
}