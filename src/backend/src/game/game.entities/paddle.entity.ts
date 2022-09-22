import { PosXY } from "../game.interfaces/pos.interface";
export class Paddle {
	width: number;
	height: number;
	position: PosXY;
	speed: number;
	reboundAngles: Array<number>;
	id: string;
	socketid: string;
}
