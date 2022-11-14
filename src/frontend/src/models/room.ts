import  User  from "./user";
import  Message  from "./message";
// import UserService from "./user"
// import Toast from '@/components/Toast.vue'
import VueAxios from 'axios';
import { API_URL } from '@/defines';

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
        this.users = [] as User[]
        for (let i = 0; i < room.users?.length; ++i)
        {
            this.users[i] = new User(room.users[i])
        }
        this.messages = [] as Message[]
        for (let i = 0; i < room.messages?.length; ++i)
        {
            this.findUser(room.messages[i]?.senderId)
            .then(user => (this.messages[i] = new Message(room.messages[i], user)))
        }
        this.admins = room.admins
        this.unreadCount = 0
        this.typingUsers = []
        this.owner = room.owner
        // console.warn("Room constructor called", room);

    }

    access: Access  = 0
    roomId: number = null
    roomName: string = null

    users: User[] | undefined = []
    admins: User[] | undefined = []
    owner: User | undefined

    messages: Message[] | undefined = []

    unreadCount: number | undefined = 0

    typingUsers: number [] | undefined = []



    // messagesLoaded: boolean = false

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
            user = new User(await VueAxios({
                        url: '/users/find/' + userId,
                        baseURL: API_URL, method: 'GET',
                        withCredentials: true}))
        }

        return user
    }

}

