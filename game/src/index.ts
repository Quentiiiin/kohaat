import { Server } from "socket.io";
import { AuthHandshakeSchema, type AuthHandshake } from '../../shared/schema';
import { sendError } from "./util";
import { QuizGame } from "./QuizGame";
import { QuizMaster } from "./QuizMaster";
import { Hono } from "hono";
import z from "zod";

const WS_PORT = 4000;
const HTTP_PORT = 4001;

const io = new Server({
    cors: {
        origin: 'http://localhost:5173'
    }
});

io.listen(WS_PORT);

const http = new Hono();
http.post('/create', async (c) => {
    const parsed = z.object({ userId: z.uuid() }).safeParse(await c.req.json());
    if (!parsed.data) return c.text('validation error', 400);
    const game = new QuizGame([q1], io);
    const master = new QuizMaster(parsed.data.userId, game);
    game.master = master;
    games.push(game);
    return c.json({ gameId: game.id });
});
http.get('/game-status/:id', (c) => {
    const game = games.find(g => g.id === c.req.param('id'));
    if (!game) return c.text('game not found', 404);
    return c.json({ phase: game.phase });
});


export default {
    port: HTTP_PORT,
    fetch: http.fetch,
}


const games: QuizGame[] = [];

const q1 = {
    question: 'Gubi?',
    answers: ['fortnite', 'brawl stars'],
    correctAnswer: 0
}


io.on("connection", (socket) => {
    let handshake: AuthHandshake;

    try {
        handshake = AuthHandshakeSchema.parse(socket.handshake.auth);
    } catch (error) {
        sendError(socket, 'no valid auth handshake provided');
        socket.disconnect(true);
        return;
    }
    if (handshake.kind === 'JOIN') {
        const game = games.find((g) => g.id === handshake.gameId);
        if (!game) {
            sendError(socket, 'game not found');
            socket.disconnect(true);
            return;
        }
        if (game.master?.id === handshake.userId) {
            sendError(socket, 'you cant join a game you are hosting');
            socket.disconnect(true);
            return;
        }
        const maybePlayer = game.players.find((p) => p.id === handshake.userId);
        if (maybePlayer) {
            maybePlayer.reconnect(socket);
        } else if (game.phase === 'WAITING') {
            game.addPlayer(handshake.username, handshake.userId, socket);
        }
    } else if (handshake.kind === 'HOST') {
        if (handshake.gameId) {
            const game = games.find((g) => g.id === handshake.gameId);
            if (game && game.master && game.master.id === handshake.userId) {
                game.master.reconnect(socket);
                return;
            } else if (game && game.master && game.master.id !== handshake.userId) {
                sendError(socket, 'you are not the host of this game');
                socket.disconnect(true);
                return;
            }
        }
        sendError(socket, 'could not connect to game');
        socket.disconnect();
    }
});