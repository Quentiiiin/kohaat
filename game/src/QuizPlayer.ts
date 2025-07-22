import type { Socket } from "socket.io";
import type { QuizGame } from "./QuizGame";

export class QuizPlayer {
    id: string;
    name: string;
    socket: Socket | null;
    game: QuizGame;

    constructor(name: string, id: string, game: QuizGame, socket: Socket) {
        this.id = id;
        this.name = name;
        this.socket = socket;
        this.game = game;

        this.socket.join(this.game.id);

        this.socket.on("disconnect", () => {
            this.socket = null;
        });
    }

    //disconnect the old socket and connect the new one
    reconnect(newSocket: Socket) {
        this.socket?.disconnect();
        this.socket = newSocket;
        this.socket.join(this.game.id);
    }
}