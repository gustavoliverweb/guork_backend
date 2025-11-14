import app from "../src/app"; // apunta al TS original, no a dist
import http, { IncomingMessage, ServerResponse } from "http";

type VercelRequest = IncomingMessage;
type VercelResponse = ServerResponse;

const server = http.createServer(app);

export default function handler(req: VercelRequest, res: VercelResponse) {
  server.emit("request", req, res);
}
