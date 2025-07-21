import { Server, Socket } from "socket.io";
import { AuthHandshakeSchema, QuizMessageSchema, type AuthHandshake, type QuizGame, type QuizMessage } from '../../shared/schema';
import { generateRandomId } from "./util";
import { z } from 'zod';

const io = new Server({
    cors: {
        origin: 'http://localhost:5173'
    }
});

const games: QuizGame[] = [];

function createGame(): string {
    const gameId = '123456' //generateRandomId();
    const game: QuizGame = {
        id: gameId,
        players: [],
        questions: [],
        currentQuestion: 0,
        hasStarted: false
    };
    games.push(game);
    return gameId;
}

createGame()

io.on("connection", (socket) => {
    let handshake: AuthHandshake;
    try {
        handshake = AuthHandshakeSchema.parse(socket.handshake.auth);
    } catch (error) {
        sendError(socket, 'no valid auth handshake provided');
        socket.disconnect(true);
        return;
    }

    const game = games.find((g) => g.id === handshake.gameId);
    if (!game) {
        sendError(socket, 'game not found');
        socket.disconnect(true);
        return;
    }
    const maybePlayer = game.players.find((p) => p.id === handshake.userId);
    if (maybePlayer && maybePlayer.isConnected) {
        sendError(socket, 'player with same id already connected');
        socket.disconnect(true);
        return;
    }
    //if player is already in the game but disconnected
    if (maybePlayer && !maybePlayer.isConnected) {
        maybePlayer.isConnected = true;
        socket.join(game.id);
        updateGameState(game.id);
    }

    //if player is new
    if (!game.hasStarted && !maybePlayer) {
        game.players.push({
            name: handshake.username,
            id: handshake.userId,
            givenAnswers: [],
            answerTimeDelta: [],
            score: 0,
            isConnected: true
        });
        socket.join(game.id);
        updateGameState(game.id);
    }
    socket.on("game", (data) => {
        try {
            const j = JSON.parse(data);
            const parsedMessage = QuizMessageSchema.parse(j);

            if (parsedMessage.kind === 'ANSWER') {
                if (socket.rooms.size === 0 || !(games.find((g) => g.id === Array.from(socket.rooms)[0]))) {
                    sendError(socket, 'client is in no game');
                    return;
                }
            }
        } catch (error) {
            console.log('invalid packet received from ', socket.id);
        }
    });

    socket.on("disconnect", () => {
        console.log('socket disconnected')
        const game = games.find((g) => g.id === handshake.gameId);
        if (!game) return;
        const player = game.players.find((p) => p.id === handshake.userId);
        if (player) player.isConnected = false;
        updateGameState(handshake.gameId);
    });
});

io.listen(4000);

function sendError(socket: Socket, message: string) {
    const m: QuizMessage = {
        kind: 'ERROR',
        payload: message
    }
    socket.emit("game", JSON.stringify(m));
}

function updateGameState(gameId: string) {
    const game = games.find((g) => g.id === gameId);
    if (!game) return;

    // Only include questions up to and including the current question
    const visibleQuestions = game.questions
        .slice(0, game.currentQuestion + 1)
        .map((question, index) => {
            // For the current question, remove the correctAnswer
            if (index === game.currentQuestion) {
                return {
                    question: question.question,
                    answers: question.answers,
                    // correctAnswer is omitted
                };
            }
            // For previous questions, include everything (including correctAnswer for review)
            return question;
        });
    const strippedGame: QuizGame = {
        id: game.id,
        players: game.players,
        questions: visibleQuestions,
        hasStarted: game.hasStarted,
        currentQuestion: game.currentQuestion,
    };
    const message: QuizMessage = {
        kind: 'GAME_STATE_UPDATE',
        payload: strippedGame
    }
    io.to(gameId).emit("game", JSON.stringify(message));
}