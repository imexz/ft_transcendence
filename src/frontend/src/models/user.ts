export enum UserStatus {
	ONLINE,
	OFFLINE,
  PLAYING,
  SPECTATING,
}

export default class User {
  // constructor(id: number, username: string, avatar_url: string,
  //   avatar_url_42intra: string, userStatus: UserStatus, clientId: any, isTwoFactorAuthenticationEnabled: boolean) {
  //   this._id = id
  //   this.id = id
  //   this.username = username
  //   this.avatar_url = avatar_url
  //   this.avatar_url_42intra = avatar_url_42intra
  //   this.userStatus = userStatus
  //   this.clientId = clientId
  //   this.isTwoFactorAuthenticationEnabled = isTwoFactorAuthenticationEnabled
  // }
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
}
//   constructor(id: number, username: string, avatar_url: string,
//     status: string, me: number
//     // , isTwoFactorAuthenticationEnabled: boolean,
//     // twoFactorAuthenticationSecret: null
//     ){
//     this.id = id
//     this.username = username
//     this.avatar_url = avatar_url
//     this.status = status
//     this.me = me
//     // this.isTwoFactorAuthenticationEnabled = isTwoFactorAuthenticationEnabled
//     // this.twoFactorAuthenticationSecret = twoFactorAuthenticationSecret
//   }
//   id: number
//   username: string
//   avatar_url: string

//   status: string
//   me: number
//   // isTwoFactorAuthenticationEnabled: boolean
//   // twoFactorAuthenticationSecret: any
// }
