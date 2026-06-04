import { NextFunction, Response, Request } from "express";

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