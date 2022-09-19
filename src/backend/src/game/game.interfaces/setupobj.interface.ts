import { PosXY } from "./pos.interface";

export interface SetupObj {
	ballPos: PosXY;
	ballRadius: number;
	ballSpeed: number;
	ballDir: PosXY;
	paddleWidth: number;
	paddleHeight: number;
	paddleSpeed: number;
	scoreIncrease: number;
}
