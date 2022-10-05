export default class User {
  constructor(_id: number, username: string, avatar_url: string,
    avatar_url_42intra: string, current_status: any, clientId: any) {
    this._id = _id
    this.username = username
    this.avatar_url = avatar_url
    this.avatar_url_42intra = avatar_url_42intra
    this.current_status = current_status
    this.clientId = clientId
  }
  _id: number
  username: string
  avatar_url: string
  current_status: any
  avatar_url_42intra: string
  clientId: any
}
