import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export default function generarJWT (uid: string, email: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const payload = { uid, email };
        jwt.sign(payload, process.env.SECRET_JWT_SEED || '', {
            expiresIn: '168h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        })
    })
}
