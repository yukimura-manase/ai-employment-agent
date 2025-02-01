import { Hono } from "hono";
import { env } from "hono/adapter";
import { WebSocket, WebSocketServer } from "ws";

export const aiChatRouter = new Hono();
