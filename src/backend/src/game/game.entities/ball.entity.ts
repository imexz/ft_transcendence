import { PosXY } from "../game.interfaces/pos.interface";
import { BallDirObj } from "../game.interfaces/balldirobj.interface";

export class Ball {
	radius: number;
	position: PosXY;
	direction: BallDirObj;
}
