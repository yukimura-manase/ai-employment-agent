import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRouter } from "./api/user/index.js"; // ES Modules なので拡張子が必要 (TSでもJSを指定する)

// これだけで .env が読み込まれ、
// process.env.XXX にアクセスできるようになる
import "dotenv/config";

const app = new Hono();

// CORS設定
app.use(
  "*",
  cors({
    origin: "*",
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// toC User Entity API Group
app.route("/users", userRouter);

const port = 3500;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
