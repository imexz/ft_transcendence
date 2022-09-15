import { PosXY } from "./pos.interface";
import { BallDirObj } from "./balldirobj.interface";

export interface BallObj {
	radius: number;
	position: PosXY;
	direction: BallDirObj;
}
