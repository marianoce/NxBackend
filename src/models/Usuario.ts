import { Document, Schema, Model, model, Error } from "mongoose";

export interface IUsuario extends Document {
  email: String;
  password: String;
  fechaCreacion: Date;
  ultimaIp: String;
  rol: String;
  fechaUltimoThread: Date;
  fechaUltimoComentario: Date;
  ultimoToken: String;
  intentos: number;
  bloqueado: Boolean;
}

export const RolesValidos = {
    values: ['USER', 'MOD', 'ADMIN'],
    message: '{VALUE} no es un rol valido o permitido'
}

export enum RolesEnum {
    USER = 'USER',
    MOD = 'MOD',
    ADMIN = 'ADMIN'
}

export const usuarioSchema = new Schema({
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    fechaCreacion: {
        type: Date,
        required: true,
    },
    ultimaIp: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        default: 'USER',
        enum: RolesValidos,
        required: true
    },
    fechaUltimoThread: {
        type: Date
    },
    fechaUltimoComentario: {
        type: Date
    },
    ultimoToken: {
        type: String
    },
    intentos: {
        type: Number,
        default: 0
    },
    bloqueado: {
        type: Boolean,
        default: false
    }
});


export const Usuario: Model<IUsuario> = model<IUsuario>("Usuario", usuarioSchema);


/*
- email: mail del usuario, UQ de la tabla
- password: password
- fechaCreacion: fecha de registro del usuario
- ipCreacion: ip de la creacion del usuario
- rol: rol del usuario
- fechaUltimoThread: fecha de el ultimo thread creado
- fechaUltimoComentario: fecha de el ultimo post creado
- ultimoToken: ultimo token generado
- intentos: cantidad de intentos de logueo registrados, luego de 5 se bloquea.
- bloqueado: solo se pone en false si se reinicia el password.
*/