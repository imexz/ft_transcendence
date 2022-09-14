export default class User {
  constructor(id: number, unique_name: string, avatar_url: string,
    avatar_url_42intra: string, current_status: any, clientId: any) {
    this.id = id
    this.unique_name = unique_name
    this.avatar_url = avatar_url
    this.avatar_url_42intra = avatar_url_42intra
    this.current_status = current_status
    this.clientId = clientId
  }
  id: number
  unique_name: string
  avatar_url: string
  current_status: any
  avatar_url_42intra: string
  clientId: any
}
