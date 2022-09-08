export default class User {
  constructor(id: number, unique_name: string, avatar_url: string) {
    this.id = id
		this.unique_name = unique_name
		this.avatar_url = avatar_url
  }
  id: number
  unique_name: string
  avatar_url: string
}