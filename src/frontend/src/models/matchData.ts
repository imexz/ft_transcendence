export default class MatchData {
  constructor(opponent: number,  myScore: number, opponentScore: number){
      this.opponent = opponent;
      this.myScore = myScore;
      this.opponentScore = opponentScore;
  }
  opponent: number
  myScore: number
  opponentScore : number
}