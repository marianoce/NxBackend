import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcryptjs';
import generarJWT from '../helpers/generarJWT';
import { Usuario, IUsuario, RolesValidos } from '../models/Usuario';
import LogController from './errorLogController';

const logController = new LogController();
const source = 'authController';

export default class AuthController {

    public async newUsuario(req: Request, res: Response) {
        const { email, password } = req.body;
        
        try {
            let usuario = await Usuario.findOne({ email: email });
            if (usuario) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Un usuario existe con ese correo'
                });
            }

            //Creacion de nuevo usuario
            const newUsuario: IUsuario = new Usuario(req.body);
            newUsuario.fechaCreacion = new Date();
            newUsuario.ultimaIp = req.ipCliente;
            newUsuario.rol = 'USER';
            newUsuario.bloqueado = true;

            //Encriptacion
            const salt = bcrypt.genSaltSync();
            newUsuario.password = bcrypt.hashSync(password, salt);
            await newUsuario.save();
          
            res.status(201).json({
                ok: true,
                uid: newUsuario.id,
                name: newUsuario.email
            })
        } catch (error) {
            logController.add(new Date(), source, error);
            res.status(500).json({
                ok: false,
                msg: 'Contactese con el administrador'
            })
        }
    };

    public async loginUsuario (req: Request, res: Response) {
        const { email, password } = req.body;
    
        try {
            let usuario = await Usuario.findOne({ email: email });
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuario y Contraseña incorrectas.'
                })
            }

            //Guardo la ultima IP
            usuario.ultimaIp = req.ipCliente;

            if (usuario.bloqueado) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuario bloqueado, reinicie el password.'
                });
            }
    
            //Confirmar los passwords
            const validPassword = bcrypt.compareSync(password, usuario.password.toString());
            if (!validPassword) {
                usuario.intentos++;
                usuario.bloqueado = usuario.intentos === 5;
                await usuario.save();

                return res.status(400).json({
                    ok: false,
                    msg: 'Usuario y Contraseña incorrectas.'
                })
            }
    
            //Generacion de JWT
            const token = await generarJWT(usuario.id, usuario.email.toString());

            //Vuelco el JWT en la base
            usuario.ultimoToken = token;
            await usuario.save();

            res.json({
                ok: true,
                uid: usuario.id,
                name: usuario.email,
                token
            })
    
        } catch (error) {
            logController.add(new Date(), source, error);
            res.status(500).json({
                ok: false,
                msg: 'Contactese con el administrador'
            })
        }
    };

    public async revalidarToken (req: Request, res: Response) {
        try {
            const uid = req.uid;
            const name = req.email;
            const token = await generarJWT(uid, name);

            //Busco el usuario, si es valido regenero el JWT.
            let usuario = await Usuario.findById(uid);
            if (!usuario) {
                res.status(400).json({
                    ok: false,
                    msg: 'Usuario invalido'
                })
            } else {
                //Vuelco el JWT en la base
                usuario.ultimoToken = token;
                await usuario.save();
            }
        
            res.json({
                ok: true,
                uid,
                token
            })
        } catch (error) {
            logController.add(new Date(), source, error);
            res.status(500).json({
                ok: false,
                msg: 'Contactese con el administrador'
            })
        }
    };

}