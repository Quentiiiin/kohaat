import type { Server, Socket } from "socket.io";
import type { QuizMessage, QuizPhase, QuizPlayerLight, QuizQuestion } from "../../shared/schema";
import { QuizPlayer } from "./QuizPlayer";
import { generateRandomId } from "./util";

export class QuizGame {
    id: string;
    phase: QuizPhase = 'WAITING';
    players: QuizPlayer[] = [];
    questions: QuizQuestion[];
    currentQuestionIndex: number = -1;
    questionEndTime: number = -1;
    io: Server;
    questionTimeout: NodeJS.Timeout | null = null;

    constructor(questions: QuizQuestion[], io: Server) {
        this.id = '123456' //generateRandomId();
        this.questions = questions;
        this.io = io;
    }

    addPlayer(name: string, id: string, socket: Socket) {
        this.players.push(new QuizPlayer(name, id, this, socket));
        this.start();
        this.updateGameState();
    }

    start() {
        this.phase = 'PLAY';
        this.nextQuestion();
    }

    nextQuestion() {
        if (this.phase !== 'PLAY') return;
        if (this.currentQuestionIndex >= this.questions.length - 1) {
            //all questions done
            this.phase = 'END';
            this.updateGameState();
            return;
        };

        this.questionTimeout?.close();

        this.currentQuestionIndex++;
        this.questionEndTime = new Date().getTime() + 1000 * 10;

        this.questionTimeout = setTimeout(() => {
            this.nextQuestion();
        }, 1000 * 10);
        this.updateGameState();
    }

    updateGameState() {
        const lightPlayers: QuizPlayerLight[] = [];

        this.players.forEach(p => {
            lightPlayers.push({
                id: p.id,
                name: p.name,
                score: p.score,
                submittedAnswer: p.answers[this.currentQuestionIndex] !== undefined
            });
        });

        const message: QuizMessage = {
            kind: 'GAME_STATE_UPDATE',
            payload: {
                id: this.id,
                phase: this.phase,
                questionEndTime: this.questionEndTime,
                currentQuestionIndex: this.currentQuestionIndex,
                questions: this.questions,
                totalQuestions: this.questions.length,
                players: lightPlayers
            }
        }
        this.io.to(this.id).emit("game", JSON.stringify(message));
    }
}