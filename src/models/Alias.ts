import { Document, Schema, Model, model, Error } from "mongoose";

export const AliasTipoValidos = {
    values: ['UNIQUEID', 'NOMBRE', 'ANON'],
    message: '{VALUE} no es un alias valido o permitido'
}

export enum AliasTipoEnum {
    UNIQUEID = 'UNIQUEID',
    NOMBRE = 'NOMBRE',
    ANON = 'ANON'
}

export interface IAlias extends Document {
  usuario: Schema.Types.ObjectId;
  thread: Schema.Types.ObjectId;
  alias: String;
}

export const aliasSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    thread: {
        type: Schema.Types.ObjectId,
        ref: 'Thread',
        required: true
    },
    alias: {
        type: String,
        required: true,
    }
});

export const Alias: Model<IAlias> = model<IAlias>("Alias", aliasSchema);

/*
- usuario: 
- thread: se entiende...
- alias del usuario: id unico, o nick, todo para un thread en especifico
*/