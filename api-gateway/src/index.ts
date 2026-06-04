import 'dotenv/config'
import express from "express";
import { createProxyMiddleware } from 'http-proxy-middleware'
import { NextFunction, Response, Request } from "express";

const app = express();
const PORT = 3000;

app.use(express.json())

export function basicAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Basic')) {
        res.status(401).json({ error: "Missing  or invalid authorization header"});
        return
    }

    const encoded = header.split(' ')[1];
    const decoded = Buffer.from(encoded, 'base64').toString();
    const [login, password] = decoded.split(':');

    if (login === process.env.BASIC_USER && password === process.env.BASIC_PASSWORD) {
        next()
    } else {
        res.status(401).json({ error: "Inavlid credentials"});
    }
}

const SCHISTE_SERVICE_URL = process.env.SCHISTE_SERVICE_URL
const VOITURES_SERVICE_URL = process.env.VOITURES_SERVICE_URL

/** @type {import('http-proxy-middleware').RequestHandler<import('express').Request, import('express').Response>} */
const voituresProxy = createProxyMiddleware({
  target: VOITURES_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {'^/api/voitures' : '/voitures'}
})

const schisteProxy = createProxyMiddleware({
  target: SCHISTE_SERVICE_URL,
  changeOrigin: true,
})

app.post('/api/voitures/*path', basicAuth, voituresProxy)
app.patch('/api/voitures/*path', basicAuth, voituresProxy)
app.delete('/api/voitures/*path', basicAuth, voituresProxy)

app.use('/api/voitures', voituresProxy)

app.use('/api/schistes', schisteProxy)

app.get("/", (_req, res) => {
  res.json({ message: "API Gateway dsj" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});