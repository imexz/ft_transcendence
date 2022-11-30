import { Socket } from 'socket.io';

export interface QueueElem {
	id: string
	socket: Socket
};