import type { Socket } from "socket.io";
import { QuizMessageSchema, type QuizMessage } from "../../shared/schema";

export function generateRandomId(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


export function sendError(socket: Socket, message: string) {
    const m: QuizMessage = {
        kind: 'ERROR',
        payload: message
    }
    socket.emit("game", JSON.stringify(m));
}

export function parseMessage(text: string): QuizMessage | null {
    let message = null;
    try {
        message = QuizMessageSchema.parse(JSON.parse(text));
    } catch (error) {
        return null;
    }
    return message;
}