import User from "./user";

export default class Game {
    winner: User
    loser: User
	scoreWinner: number = 0;
    scoreLoser: number = 0;
    isFinished: boolean = false
}