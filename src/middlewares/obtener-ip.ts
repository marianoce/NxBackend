import { NextFunction, Request, Response } from "express";

export default function obtenerIP (req: Request, res: Response, next: NextFunction): any {

    try {
        if (!req.connection.remoteAddress || req.connection.remoteAddress.length < 3) {
            return res.status(400).json({
                ok: false,
                msg: 'Error en verificacion'
            })
        }

        req.ipCliente = req.connection.remoteAddress;
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error en calculo de verificacion'
        })
    }

    next();
}