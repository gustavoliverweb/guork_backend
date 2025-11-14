declare module "../dist/app"; // para TS7016

import app from "../dist/app";
import http, { IncomingMessage, ServerResponse } from "http";

type VercelRequest = IncomingMessage;
type VercelResponse = ServerResponse;

const server = http.createServer(app);

export default function handler(req: VercelRequest, res: VercelResponse) {
  server.emit("request", req, res);
}
