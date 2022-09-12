export default class User {
  constructor(id: number, unique_name: string, avatar_url: string,
    avatar_url_42intra: string, avatar: any, friends: User[]) {
    this.id = id
    this.unique_name = unique_name
    this.avatar_url = avatar_url
    this.avatar_url_42intra = avatar_url_42intra
    this.avatar = avatar
    this.friends = friends
  }
  id: number
  unique_name: string
  avatar_url: string
  avatar_url_42intra: string
  avatar: any
  friends: User[]
}
