import { Document, Schema, Model, model, Error } from "mongoose";

export interface IComentario extends Document {
  contenido: String;
  fechaCreacion: Date;
  ipCreacion: String;
  usuario: Schema.Types.ObjectId;
  thread: Schema.Types.ObjectId;
  alias: String;
  rand: String;
  img: String;
  idImg: String;
  vid: String;
  idVid: String;
}

export const comentarioSchema = new Schema({
    contenido: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        required: true
    },
    ipCreacion: {
        type: String,
        required: true,
    },
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
        type: String
    },
    rand: {
        type: String,
        required: true
    },   
    img: {
        type: String
    },
    idImg: {
        type: String
    },
    vid: {
        type: String
    },
    idVid: {
        type: String
    }
});

export const Comentario: Model<IComentario> = model<IComentario>("Comentario", comentarioSchema);
