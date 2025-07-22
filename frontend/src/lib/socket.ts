import { PUBLIC_GAME_SOCKET_URL } from "$env/static/public";
import { io, Socket } from "socket.io-client";
import { QuizMessageSchema, type AuthHandshake, type QuizMessage } from '$shared/schema';
import { localGameState } from "./game-state.svelte";
import { browser } from "$app/environment";

let gameSocket: Socket;

function initGame() {
    const userId = localStorage.getItem('user-id') ?? crypto.randomUUID();
    localStorage.setItem('user-id', userId);

    const handshake: AuthHandshake = {
        userId,
        username: 'Quentin',
        gameId: '123456'
    }

    gameSocket = io(PUBLIC_GAME_SOCKET_URL, {
        auth: handshake
    });

    gameSocket.on("connect", () => localGameState.connected = true);
    gameSocket.on("disconnect", () => localGameState.connected = false);

    gameSocket.on("game", (m) => {
        const j = JSON.parse(m);
        const parsedMessage = QuizMessageSchema.parse(j);
        if (parsedMessage.kind === 'GAME_STATE_UPDATE') {
            console.log('gamestate updated')
            localGameState.state = parsedMessage.payload;
        } else if (parsedMessage.kind === 'ERROR') {
            console.error('Error received from socket:', parsedMessage.payload);
        }
    });
}


export function sendMessage(message: QuizMessage) {
    gameSocket.emit("game", JSON.stringify(message));
}

export function submitAnswer(index: number) {
    sendMessage({ kind: 'ANSWER', payload: index });
}

if (browser) initGame();