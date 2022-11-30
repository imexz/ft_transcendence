import { BallDirObj } from "./balldirobj.interface";
import { PosXY } from "./pos.interface";

export interface SetupObj {
	ballPos: PosXY
	ballRadius: number
	ballSpeed: number
	ballDir: BallDirObj
	paddleWidth: number
	paddleHeight: number
	paddleSpeed: number
	scoreIncrease: number
}
