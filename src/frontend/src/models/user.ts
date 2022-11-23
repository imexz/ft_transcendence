import { Status } from '@/enums/models/ResponseEnum';

export enum UserStatus {
	ONLINE,
	OFFLINE,
  PLAYING,
  SPECTATING,
}

export default class User {
  constructor(user: any) {
    this._id = user.id
    this.id = user.id
    this.username = user.username
    this.avatar_url = user.avatar_url
    this.avatar_url_42intra = user.avatar_url_42intra
    this.userStatus = user.userStatus
    this.clientId = user.clientId
    this.isTwoFactorAuthenticationEnabled = user.isTwoFactorAuthenticationEnabled
  }
  _id: number
  id: number
  username: string
  avatar_url: string

  userStatus: any
  avatar_url_42intra: string
  clientId: any
  isTwoFactorAuthenticationEnabled: boolean
  friendStatus: Status = 0
}
