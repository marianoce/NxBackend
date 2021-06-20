import { Request, Response } from "express";
import mongoose = require('mongoose');

//Modelos
import { ConfigUsuarioCategoria } from '../models/ConfigUsuarioCategoria';
import { Usuario } from "../models/Usuario";

//Controladoras
import LogController from './errorLogController';

const logController = new LogController();
const source = 'configController';

export default class ConfigController {
    
    public async updateUsuarioCategoria(req: Request, res: Response) {

        try {
                let usuarioCategorias = new ConfigUsuarioCategoria(req.body);
                let usuarioCategoriasDB = await ConfigUsuarioCategoria.findOne({ usuario: usuarioCategorias.usuario });
                let usuarioDB = await Usuario.findById(req.uid);

                if (!usuarioDB) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El usuario no existe.'
                    });
                }

                if (!usuarioCategoriasDB) {
                    usuarioCategorias.usuario = usuarioDB.id;
                    await ConfigUsuarioCategoria.create(usuarioCategorias);
                } else {
                    usuarioCategoriasDB.categorias = usuarioCategorias.categorias;
                    await usuarioCategoriasDB.save();
                }
    
                res.status(201).json({
                    ok: true
                })
        } catch (error) {
            logController.add(new Date(), source, error);
            res.status(500).json({
                ok: false,
                msg: 'Contactese con el administrador'
            });
        }
    }



    public async getUsuarioCategoria(req: Request, res: Response) {
        try {
            const usuario: any = req.uid;
            ConfigUsuarioCategoria.findOne({ usuario: usuario }, 'categorias')
            .exec(
                (err, categorias) => {
                    if (err) {
                        return res.status(500).json({
                            ok: true,
                            mensaje: 'Error cargando Categorias',
                            errors: err
                        })
                    }
                    console.log(categorias);
                    res.status(200).json({
                        ok: true,
                        categorias: categorias
                    })
                });
        } catch (error) {
            logController.add(new Date(), source, error);
            res.status(500).json({
                ok: false,
                msg: 'Contactese con el administrador'
            });
        }
    }
}