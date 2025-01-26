import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { env } from "hono/adapter";

export const AiChatRouter = new Hono();
