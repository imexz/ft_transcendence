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
    winner: User,
    loser: User,
    scoreWinner : number,
    scoreLoser : number
  ){
    this.winner = winner
    this.loser = loser
    this.scoreWinner  = scoreWinner 
    this.scoreLoser  = scoreLoser 
  }
  winner: User
  loser: User
  scoreWinner : number
  scoreLoser : number
}