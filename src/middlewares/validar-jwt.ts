import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export default function validarJWT (req: Request, res: Response, next: NextFunction): any {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la validacion'
        })
    }

    try {
        const { uid, email } = jwt.verify(token, process.env.SECRET_JWT_SEED || '') as any;
        req.uid = uid;
        req.email = email;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }

    next();
}