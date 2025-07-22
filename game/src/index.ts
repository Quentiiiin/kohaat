import { Server } from "socket.io";
import { AuthHandshakeSchema, type AuthHandshake } from '../../shared/schema';
import { sendError } from "./util";
import { QuizGame } from "./QuizGame";

const io = new Server({
    cors: {
        origin: 'http://localhost:5173'
    }
});

const games: QuizGame[] = [];

games.push(new QuizGame([{
    question: 'Gubi?',
    answers: ['fortnite', 'brawl stars'],
    correctAnswer: 0
}], io));

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
    if (maybePlayer) {
        maybePlayer.reconnect(socket);
    } else if (game.phase === 'WAITING') {
        game.addPlayer(handshake.username, handshake.userId, socket);
    }
});

io.listen(4000);