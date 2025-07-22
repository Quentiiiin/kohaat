import type { Socket } from "socket.io";
import type { QuizGame } from "./QuizGame";
import { parseMessage, sendError } from "./util";

export class QuizPlayer {
    id: string;
    name: string;
    socket: Socket | null;
    game: QuizGame;
    score: number = 0;
    answers: number[] = [];

    constructor(name: string, id: string, game: QuizGame, socket: Socket) {
        this.id = id;
        this.name = name;
        this.socket = socket;
        this.game = game;

        this.initSocket();
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
            if (parsed.kind === 'ANSWER') {
                const res = this.submitAnswer(parsed.payload);
                if(res) sendError(socket, res);
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

    /**
        checks a few conditions and then submits the answer
        @params answerIndex: the index of the answer
        @returns string: error message ; null: if submitted correctly
    */
    submitAnswer(answerIndex: number): string | null {
        if (this.game.phase !== 'PLAY') return 'not in PLAY phase';
        if (this.game.currentQuestionIndex < 0) return 'no current question';
        if (this.game.questionEndTime < new Date().getTime()) return 'question time expired';
        if (this.answers[this.game.currentQuestionIndex] !== undefined) return 'already answered';

        const currentQuestion = this.game.questions[this.game.currentQuestionIndex];
        if (!currentQuestion) return 'question not found';
        if (answerIndex > currentQuestion.answers.length - 1) return 'invalid answer index';

        this.answers[this.game.currentQuestionIndex] = answerIndex;
        this.game.updateGameState();
        return null;
    }
}