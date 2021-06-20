import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import mongoose = require('mongoose');

//Modelos
import { Thread } from '../models/Thread';
import { Usuario } from "../models/Usuario";
import { Comentario } from '../models/Comentario';
import { Alias } from '../models/Alias';

//Controladoras
import LogController from './errorLogController';
import AliasController from './aliasController';
import { cloudinaryDeleteBulk } from "../helpers/fileHandler";

const logController = new LogController();
const source = 'threadController';

//Tipo de transaccion:
const transactionOptions: any = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
};

export default class ThreadController {
    
    public async newThread(req: Request, res: Response) {

        //Declaracion de transaccion.
        const session = await mongoose.startSession();

        try {
            const transactionResults = await session.withTransaction(async () => {
                let newThread = new Thread(req.body);
                let baseThread = await Thread.findOne({ titulo: newThread.titulo }).session(session);
    
                if (baseThread) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un thread con ese nombre'
                    });
                }
    
                let usuarioDB = await Usuario.findById(req.uid).session(session);
    
                //Comparo el token del cliente con el token de la base.
                const tokenCliente = req.header('x-token');
                
                if (!usuarioDB || (usuarioDB && usuarioDB.ultimoToken != tokenCliente)) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Usuario inconsistente, vuelva a loguearse.'
                    });
                }
    
                /*
                //Me fijo la ultima vez que creo un thread el usuario.
                if (usuarioDB && usuarioDB.fechaUltimoThread && (((new Date().getTime()) - (usuarioDB.fechaUltimoThread.getTime())) / 1000) < 60) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Debe de esperar un minuto antes de crear otro thread'
                    });
                }
                */
                
                //Creo el nuevo thread
                newThread.usuario = usuarioDB?.id;
                newThread.fechaCreacion = new Date();
                newThread.fechaUltimoComentario = newThread.fechaCreacion;
                newThread.sticky = false;
                newThread.cerrado = false;
                newThread.ipCreacion = req.ipCliente;
                await Thread.create([newThread], { session });
    
                //Tambien grabo la fecha en el usuario
                if (usuarioDB) {
                    usuarioDB.fechaUltimoThread = newThread.fechaCreacion;
                    await usuarioDB.save();
                }
    
                //En caso de que haya llegado al tope de threads, borro los ultimos threads (Menos los stickys).
                if (await Thread.countDocuments({}).session(session) > (process.env.CANT_THREADS || 0)) {
                    const threadABorrar = await Thread.findOne({ sticky: false }).sort({ fechaUltimoComentario: 1}).session(session);
                    //Borro: Los comentarios, los alias y el thread.
                    if (threadABorrar) {
                        //Alias
                        await Alias.deleteMany({ thread: threadABorrar.id }).session(session);
                        
                        //Comentarios
                        const idImgsVid = await Comentario.find({ thread: threadABorrar.id }, 'idImg idVid').session(session);
                        if (idImgsVid.length > 0) {
                            const idsImg = idImgsVid.filter(q => q.idImg && q.idImg !== '');
                            const idsVid = idImgsVid.filter(q => q.idVid && q.idVid !== '');

                            if (idsImg.length > 0) {
                                await cloudinaryDeleteBulk(idsImg.map(p => p.idImg.toString()), 'image');
                            }
                            if (idsVid.length > 0) {
                                await cloudinaryDeleteBulk(idsVid.map(p => p.idVid.toString()), 'video');
                            }
                            await Comentario.deleteMany({ thread: threadABorrar.id }).session(session);
                        }

                        //Thread
                        const idImgs = await Thread.find({ _id: threadABorrar.id}, 'idImg').session(session);
                        await cloudinaryDeleteBulk(idImgs.map(p => p.idImg.toString()), 'image');
                        await Thread.findByIdAndDelete(threadABorrar.id).session(session);
                    }
                }
                
                res.status(201).json({
                    ok: true,
                    thread: {
                        _id: newThread.id,
                        titulo: newThread.titulo,
                        fechaCreacion: newThread.fechaCreacion,
                        img: newThread.img,
                        sticky: newThread.sticky,
                        cerrado: newThread.cerrado,
                        aliasTipo: newThread.aliasTipo,
                        cantComentarios: newThread.cantComentarios
                    }
                })
            }, transactionOptions);
        } catch (error) {
            logController.add(new Date(), source, error);
            res.status(500).json({
                ok: false,
                msg: 'Contactese con el administrador'
            })
        }
    }

    public async getThread(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const baseThread = await Thread.findById(id, 'titulo contenido fechaCreacion img sticky cerrado aliasTipo cantComentarios categoria');

            if (!baseThread) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No existe un thread con ese ID'
                });
            }

            const comentarios = await Comentario.find({ thread: baseThread?.id }, 'contenido fechaCreacion alias rand img idImg vid idVid')
                                .sort({ fechaCreacion: -1 });
            
            res.status(200).json({
                ok: true,
                thread: baseThread,
                comentarios
            })
        } catch (error) {
            logController.add(new Date(), source, error);
            res.status(500).json({
                ok: false,
                msg: 'Contactese con el administrador'
            })
        }
    }

    public async getListado(req: Request, res: Response) {
        try {
            const { desde } = req.body;
            Thread.find({}, 'titulo fechaCreacion img sticky cerrado aliasTipo cantComentarios categoria')
            .sort({ sticky: 1, fechaUltimoComentario: -1 })
            .skip(parseInt(desde))
            .limit(40)
            //.populate()
            .exec(
                (err, threads) => {
                    if (err) {
                        return res.status(500).json({
                            ok: true,
                            mensaje: 'Error cargando Threads',
                            errors: err
                        })
                    }
    
                    Thread.count({}, (error, cont) => {
                        res.status(200).json({
                            ok: true,
                            thread: threads,
                            total: cont
                        })
                    });
                });
        } catch(error) {
            logController.add(new Date(), source, error);
            res.status(500).json({
                ok: false,
                msg: 'Contactese con el administrador'
            })
        }
    }

    public async comentarThread(req: Request, res: Response) {
        //Declaracion de transaccion.
        const session = await mongoose.startSession();

        try {
            //Abro transaccion
            const transactionResults = await session.withTransaction(async () => {
                const { thread, contenido, idImg, img, idVid, vid } = req.body;

                let baseThread = await Thread.findById(thread).session(session);
    
                if (!baseThread) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El thread no existe'
                    });
                } else if (baseThread && baseThread.cerrado)  {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El thread esta cerrado a comentarios'
                    });
                }

                let usuarioDB = await Usuario.findById(req.uid).session(session);
                if (!usuarioDB) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El usuario no existe'
                    });
                }
                
                // if (usuarioDB.fechaUltimoComentario && (((new Date().getTime()) - (usuarioDB.fechaUltimoComentario.getTime())) / 1000) < 15) {
                //     return res.status(400).json({
                //         ok: false,
                //         msg: 'Debe esperar que transcurran 15 segundos para poder comentar'
                //     });
                // }
    
                //Creo el comentario
                let newComentario = new Comentario();
                newComentario.usuario = usuarioDB.id;
                newComentario.thread = baseThread.id;
                newComentario.contenido = contenido;
                newComentario.ipCreacion = req.ipCliente;
                newComentario.fechaCreacion = new Date();
                newComentario.idImg = idImg;
                newComentario.img = img;
                newComentario.idVid = idVid;
                newComentario.vid = vid;
                newComentario.rand = uuidv4().slice(-11);
                newComentario.alias = await new AliasController().obtenerAlias(baseThread.id, usuarioDB.id, baseThread.aliasTipo);

                await Comentario.create([newComentario], { session });
                
                //Actualizo la fecha del ultimo comentario en el thread
                baseThread.fechaUltimoComentario = newComentario.fechaCreacion;
                baseThread.cantComentarios += 1;
                await baseThread.save();

                //Actualizo la fecha del ultimo comentario en el usuario
                usuarioDB.fechaUltimoComentario = newComentario.fechaCreacion;
                await usuarioDB.save();

                res.status(201).json({
                    ok: true,
                    comentario: newComentario
                });
            }, transactionOptions);
        } catch(error) {
            logController.add(new Date(), source, error);
            res.status(500).json({
                ok: false,
                msg: 'Contactese con el administrador'
            })
        } finally {
            await session.endSession();
        }
    }

}