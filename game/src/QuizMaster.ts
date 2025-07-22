import type { Socket } from "socket.io";
import type { QuizGame } from "./QuizGame";
import { parseMessage, sendError } from "./util";

export class QuizMaster {
    id: string;
    socket: Socket | null = null;
    game: QuizGame;

    constructor(id: string, game: QuizGame) {
        this.id = id;
        this.game = game;
    }

    initSocket() {
        if (!this.socket) return;
        const socket = this.socket;

        socket.join(this.game.id);

        socket.on("disconnect", () => {
            this.socket = null;
        });

        socket.on("game", (message) => {
            const parsed = parseMessage(message);
            if (!parsed) {
                sendError(socket, "invalid packet received");
                return;
            }

            if (parsed.kind === 'START_GAME') {
                this.game.start();
            } else if (parsed.kind === 'NEXT_QUESTION') {
                this.game.nextQuestion();
            } else if (parsed.kind === 'KICK_PLAYER') {
                this.game.kick(parsed.payload);
            } else if (parsed.kind === 'END_GAME') {
                this.game.end();
            }
        });
    }

    //disconnect the old socket and connect the new one
    reconnect(newSocket: Socket) {
        this.socket?.disconnect();
        this.socket = newSocket;
        this.initSocket();
        this.game.updateGameState();
    }
}