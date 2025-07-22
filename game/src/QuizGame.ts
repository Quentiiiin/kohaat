import type { Socket } from "socket.io";
import type { QuizPhase, QuizQuestion } from "../../shared/schema";
import { QuizPlayer } from "./QuizPlayer";
import { generateRandomId } from "./util";

export class QuizGame {

    id: string;
    phase: QuizPhase = 'WAITING';
    players: QuizPlayer[] = [];
    questions: QuizQuestion[];
    currentQuestionIndex: number = -1;

    constructor(questions: QuizQuestion[]) {
        this.id = generateRandomId();
        this.questions = questions;
    }

    addPlayer(name: string, id: string, socket: Socket) {
        this.players.push(new QuizPlayer(name, id, this, socket));
    }

    start() {
        this.phase = 'PLAY';
        this.nextQuestion();
    }

    nextQuestion() {
        if(this.phase !== 'PLAY') return;
        if(this.currentQuestionIndex > this.questions.length - 1) return;

        this.currentQuestionIndex++;
    }
}