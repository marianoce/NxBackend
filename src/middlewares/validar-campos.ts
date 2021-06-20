import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator';

export default function validarCampos (req: Request, res: Response, next: NextFunction): any {
    
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: errores.mapped()
        })
    }

    next();
}