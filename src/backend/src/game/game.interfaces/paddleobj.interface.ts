import { PosXY } from "./pos.interface";

export interface PaddleObj {
	width: number;
	height: number;
	position: PosXY;
	speed: number;
	reboundAngles: Array<number>;
	id: string;
}
