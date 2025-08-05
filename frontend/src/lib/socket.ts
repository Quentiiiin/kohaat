import { PUBLIC_GAME_SOCKET_URL } from "$env/static/public";
import { io, Socket } from "socket.io-client";
import { QuizMessageSchema, type AuthHandshake, type QuizMessage } from '$shared/schema';
import { localGameState } from "./game-state.svelte";
import { goto } from "$app/navigation";
import { tick } from "svelte";

let gameSocket: Socket;


export async function initGame(master: boolean, gameId: string, username?: string) {
    await tick(); //!!Important, or else the userId wont be loaded yet
    const handshakePlayer: AuthHandshake = {
        kind: 'JOIN',
        userId: localGameState.userId,
        username: username ?? 'default',
        gameId
    }

    const handshakeMaster: AuthHandshake = {
        kind: 'HOST',
        userId: localGameState.userId,
        gameId
    }
    const handshake = master ? handshakeMaster : handshakePlayer;

    gameSocket = io(PUBLIC_GAME_SOCKET_URL, {
        path: '/game-socket/',
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
        } else if (parsedMessage.kind === 'PLAYER_KICKED') {
            localGameState.showKickedMessage = true;
            goto('/');
        }
    });

    setInterval(() => {
        const start = Date.now();

        gameSocket.emit("ping", () => {
            const duration = Date.now() - start;
            localGameState.latency = duration;
        });
    }, 1000 * 10);

}


export function sendMessage(message: QuizMessage) {
    gameSocket.emit("game", JSON.stringify(message));
}

export function submitAnswer(index: number) {
    sendMessage({ kind: 'ANSWER', payload: index });
}