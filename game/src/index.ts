import { Server, Socket } from "socket.io";
import { AuthHandshakeSchema, QuizMessageSchema, type AuthHandshake, type QuizGame, type QuizMessage, type QuizPlayer } from '../../shared/schema';

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
        currentQuestionIndex: 0,
        hasStarted: false
    };
    games.push(game);
    return gameId;
}

createGame()

io.on("connection", (socket) => {
    let handshake: AuthHandshake;
    let player: QuizPlayer;
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
        player = maybePlayer;
        socket.join(game.id);
        updateGameState(game.id);
    }

    //if player is new
    if (!game.hasStarted && !maybePlayer) {
        player = {
            name: handshake.username,
            id: handshake.userId,
            givenAnswers: [],
            answerTimeDelta: [],
            score: 0,
            isConnected: true
        };
        game.players.push(player);
        socket.join(game.id);
        updateGameState(game.id);
    }
    socket.on("game", (data) => {
        try {
            const j = JSON.parse(data);
            const parsedMessage = QuizMessageSchema.parse(j);
            if (parsedMessage.kind === 'ANSWER') {
                if (!game.hasStarted) {
                    sendError(socket, "game has not started yet");
                    return;
                }
                if (player.givenAnswers[game.currentQuestionIndex] !== undefined) {
                    sendError(socket, "already submitted an answer for this question");
                    return;
                }
                const currentQuestion = game.questions[game.currentQuestionIndex];
                if (!currentQuestion) {
                    sendError(socket, "no more questions left");
                    return;
                }
                if (parsedMessage.payload > currentQuestion.answers.length - 1) { //no need to check for under 0 because of schema
                    sendError(socket, "no question with that index");
                    return;
                }
                player.givenAnswers[game.currentQuestionIndex] = parsedMessage.payload; //set at index instead of push because player might skipped a question
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
        .slice(0, game.currentQuestionIndex + 1)
        .map((question, index) => {
            // For the current question, remove the correctAnswer
            if (index === game.currentQuestionIndex) {
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
        currentQuestionIndex: game.currentQuestionIndex,
    };
    const message: QuizMessage = {
        kind: 'GAME_STATE_UPDATE',
        payload: strippedGame
    }
    io.to(gameId).emit("game", JSON.stringify(message));
}