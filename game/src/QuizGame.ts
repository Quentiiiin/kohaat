import type { Server, Socket } from "socket.io";
import type { QuizMessage, QuizPhase, QuizPlayerLight, QuizQuestion } from "../../shared/schema";
import { QuizPlayer } from "./QuizPlayer";
import { generateRandomId, sendError } from "./util";
import type { QuizMaster } from "./QuizMaster";

export class QuizGame {
    id: string;
    phase: QuizPhase = 'WAITING';
    players: QuizPlayer[] = [];
    questions: QuizQuestion[];
    currentQuestionIndex: number = -1;
    questionEndTime: number = -1;
    questionStartTime: number = -1;
    io: Server;
    questionTimeout: NodeJS.Timeout | null = null;
    hasAppliedScores: boolean = false;

    master: QuizMaster | null = null;

    constructor(questions: QuizQuestion[], io: Server) {
        this.id = '123456' //generateRandomId();
        this.questions = questions;
        this.io = io;
    }

    addPlayer(name: string, id: string, socket: Socket) {
        this.players.push(new QuizPlayer(name, id, this, socket));
        if (this.players.length > 1) {
            this.start();
        }
        this.updateGameState();
    }

    start() {
        if (!this.master) return; //dont start game without a quizmaster
        this.phase = 'PLAY';
        this.nextQuestion();
    }

    nextQuestion() {
        if (!this.hasAppliedScores) this.applyScores();
        if (this.phase !== 'PLAY') return;
        if (this.currentQuestionIndex >= this.questions.length - 1) {
            //all questions done
            this.phase = 'END';
            this.updateGameState();
            return;
        };

        this.questionTimeout?.close();

        this.currentQuestionIndex++;
        this.questionStartTime = new Date().getTime();
        this.questionEndTime = this.questionStartTime + 1000 * 10;
        this.hasAppliedScores = false;

        this.questionTimeout = setTimeout(() => {
            this.nextQuestion();
        }, 1000 * 10);
        this.updateGameState();
    }

    end() {
        if (!this.hasAppliedScores) this.applyScores;
        this.questionTimeout?.close();

        this.phase = 'END';
        this.updateGameState();
    }

    applyScores() {
        this.hasAppliedScores = true;
        const questionIndex = this.currentQuestionIndex;
        if (questionIndex < 0) return;

        const correctPlayers = this.players.filter(
            p => p.answers[questionIndex] === this.questions[questionIndex]?.correctAnswer
        );

        correctPlayers.sort((a, b) => {
            return (
                (a.answerTimeDeltas[questionIndex] ?? Infinity) -
                (b.answerTimeDeltas[questionIndex] ?? Infinity)
            );
        });

        if (correctPlayers.length === 0) return;

        const fastestTime = correctPlayers[0]?.answerTimeDeltas[questionIndex] ?? 0;

        correctPlayers.forEach(player => {
            const playerTime = player.answerTimeDeltas[questionIndex] ?? 0;
            const timeDifference = playerTime - fastestTime;
            const score = Math.max(700, Math.round(1000 - timeDifference / 10));
            player.score += score;
        });
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

        const strippedQuestions: QuizQuestion[] = [];

        this.questions.forEach((q, i) => {
            if (i > this.currentQuestionIndex) return;
            strippedQuestions.push({
                question: q.question,
                answers: q.answers,
            });
        });

        const message: QuizMessage = {
            kind: 'GAME_STATE_UPDATE',
            payload: {
                id: this.id,
                phase: this.phase,
                questionEndTime: this.questionEndTime,
                currentQuestionIndex: this.currentQuestionIndex,
                questions: strippedQuestions,
                totalQuestions: this.questions.length,
                players: lightPlayers
            }
        }
        this.io.to(this.id).emit("game", JSON.stringify(message));
    }

    kick(userId: string) {
        const player = this.players.find(p => p.id === userId);
        if (!player) return;
        this.players = this.players.filter(p => p.id !== player.id);
        if (player.socket) {
            sendError(player.socket, 'player got kicked by the host');
            player.socket?.disconnect(true);
        }
        this.updateGameState();
    }
}