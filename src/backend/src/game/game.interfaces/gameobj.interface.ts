import { BallObj } from "./ballobj.interface";
import { PaddleObj } from "./paddleobj.interface";
import { ScoreObj } from "./scoreobj.interface";

export interface GameObj {
	ball: BallObj
	paddleLeft: PaddleObj
	paddleRight: PaddleObj
	score: ScoreObj
	scoreLeft: number
	scoreRight: number
}
