export enum UserStatus {
	ONLINE,
	OFFLINE,
  PLAYING,
  SPECTATING,
}

export default class User {
  constructor(id: number, username: string, avatar_url: string,
    avatar_url_42intra: string, userStatus: UserStatus, clientId: any, isTwoFactorAuthenticationEnabled: boolean) {
    this.id = id
    this.username = username
    this.avatar_url = avatar_url
    this.avatar_url_42intra = avatar_url_42intra
    this.userStatus = userStatus
    this.clientId = clientId
    this.isTwoFactorAuthenticationEnabled = isTwoFactorAuthenticationEnabled
  }
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
