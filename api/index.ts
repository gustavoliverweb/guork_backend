import app from "../dist/app";
import http from "http";
import { VercelRequest, VercelResponse } from "@vercel/node";

const server = http.createServer(app);

export default function handler(req: VercelRequest, res: VercelResponse) {
    server.emit("request", req, res);
}