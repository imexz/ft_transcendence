// export default class MatchData {
//   constructor(opponent: number,  myScore: number, opponentScore: number){
//       this.opponent = opponent;
//       this.myScore = myScore;
//       this.opponentScore = opponentScore;
//   }
//   opponent: number
//   myScore: number
//   opponentScore : number


// }

import User from "./user";

export default class MatchData {
  constructor(
    playerLeft: User,
    playerRight: User,
    scoreLeft : number,
    scoreRight : number
  ){
    this.playerLeft = playerLeft
    this.playerRight = playerRight
    this.scoreLeft  = scoreLeft 
    this.scoreRight  = scoreRight 
  }
  playerLeft: User
  playerRight: User
  scoreLeft : number
  scoreRight : number
}