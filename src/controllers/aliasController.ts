import { Schema } from 'mongoose';
import { Alias, IAlias, AliasTipoValidos } from '../models/Alias';
import LogController from './errorLogController';
import { v4 as uuidv4 } from 'uuid';
import { AliasTipoEnum } from '../models/Alias';

const logController = new LogController();
const source = 'aliasController';


export default class AliasController {
    public async obtenerAlias(thread: Schema.Types.ObjectId, usuario: Schema.Types.ObjectId, aliasTipo: any) {
        try {
            //Primero busco que tipo de alias es, si no es ANON, busco en la base si existe si no lo creo.
            let alias: String = '';

            if (AliasTipoEnum.ANON !== aliasTipo) {
                let aliasBase = await Alias.findOne({ thread: thread, usuario: usuario });
                if (aliasBase) {
                    alias = aliasBase.alias;
                } else {
                    aliasBase = new Alias();
                    aliasBase.thread = thread;
                    aliasBase.usuario = usuario;
                    aliasBase.alias = uuidv4().slice(-11);
                    await aliasBase.save();
                    alias = aliasBase.alias;
                }
            }

            return alias;
        } catch (error) {
            logController.add(new Date(), source, error);
            throw error;
        }
    }
}