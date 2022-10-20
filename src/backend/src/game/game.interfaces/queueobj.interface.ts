import { Socket } from 'socket.io';

export interface QueueElem {
	// id: number;
	id: string;
	socket: Socket;
};