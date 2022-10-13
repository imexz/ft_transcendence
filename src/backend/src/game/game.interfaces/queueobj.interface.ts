import { Socket } from 'socket.io';

export interface QueueElem {
	id: number;
	socket: Socket;
};