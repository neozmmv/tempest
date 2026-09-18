import { Context, Hono } from 'hono'
import { upgradeWebSocket, websocket } from 'hono/bun'
import { getCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';
import { JWT_SECRET } from '../../constants';
import type { JwtPayload } from '../../interfaces/JwtPayload';
import { authMiddleware } from '../auth/middleware';
import type { WSContext } from 'hono/ws';
import { map } from 'zod';

export const ws = new Hono();

// WEBSOCKET LOGIC

const connections = new Map<string, Set<WSContext>>();

function sendToUser(userId: string, data: string) {
    const sockets = connections.get(userId);
    if(!sockets) { // receiver offline
        return false;
    }
    for(const socket of sockets) {
        socket.send(data);
    }
    return true;
}

ws.get("/ws", authMiddleware, upgradeWebSocket((c) => {
    return {
        onOpen(_event, socket) {
            const jwt = c.get("jwtPayload") as JwtPayload
            let sockets = connections.get(jwt.sub)
            if(!sockets) { // connection not open
                sockets = new Set<WSContext>();
                connections.set(jwt.sub, sockets)
            }
            sockets.add(socket)
            console.log(jwt.sub)
        },
        onMessage(event, ws) {
            console.log(`Message from client: ${event.data}`)
            ws.send("received your message " + event.data)
        }
    }
}))