import  User  from "./user";
import  Message  from "./message";
import UserService from "./user"
import Toast from '@/components/Toast.vue'
import store from '../store/index'

export enum Access {
    public,
    private,
    protected,
    dm,
}

export default class Room {
    constructor(room: any) {
        this.access = room.access
        this.roomName = room.roomName
        this.roomId = room.roomId
        // this.messages = room.messages // run through for loop and convert to real Message object again
        this.messages = [] as Message[]
        this.users = room.users
        for (let i = 0; i < room.messages.length; ++i)
        {
            this.findUser(room.messages[i].senderId)
            .then(user => (this.messages.push(new Message(room.messages[i], user))))
            .catch(error => (console.error("User not found"),
                Toast.triggerToast('User not found', 'error')))
        }
        this.admins = room.admins
        console.warn("Room constructor called", room);

    }

    access: Access = 0
    roomId: number = null
    roomName: string = null

    users: User[] = []
    admins: User[] = []

    messages: Message[] = []

    async findUser(userId : number): Promise<User>{

        let user: User = undefined

        for (let i = 0; i < this.users.length; ++i)
        {
            if (this.users[i].id == userId)
            {
                user = this.users[i]
                break
            }
        }
        if (user == undefined)
        {
            user = await store.dispatch('getUser', userId)
        }

        return user
    }

}

