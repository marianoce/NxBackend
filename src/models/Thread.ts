import { Document, Schema, Model, model, Error } from "mongoose";
import { CategoriasValidas, CategoriasEnum } from './Categoria';
import { AliasTipoValidos } from './Alias';


export interface IThread extends Document {
  titulo: String;
  contenido: String;
  fechaCreacion: Date;
  img: String;
  idImg: String;
  fechaUltimoComentario: Date;
  sticky: Boolean;
  cerrado: Boolean;
  ipCreacion: String;
  usuario: Schema.Types.ObjectId;
  aliasTipo: String;
  cantComentarios: number;
  categoria: String;
}

export const threadSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        unique: true
    },
    contenido: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    idImg: {
        type: String,
        required: true
    },
    fechaUltimoComentario: {
        type: Date,
        required: true
    },
    sticky: {
        type: Boolean
    },
    cerrado: {
        type: Boolean
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
    aliasTipo: {
        type: String,
        enum: AliasTipoValidos
    },
    cantComentarios: {
        type: Number,
        default: 0
    },
    categoria: {
        type: String,
        required: true,
        enum: CategoriasValidas
    }
});

export const Thread: Model<IThread> = model<IThread>("Thread", threadSchema);

/*
- titulo: Titulo, maximo 40 caracteres?, estudiarlo mejor.
- contenido: Texto de contenido del thread, max: 600 caracteres?, estudiarlo mejor.
- fechaCreacion: Fecha de creacion del thread.
- img: Imagen de portada, tendra un limite de 1MB.
- idImg: Id de la imagen.
- fechaUltimoComentario: Ultima fecha de creacion de comment, se va a utilizar para eliminar los post sin comments.
- sticky: Indica si el thread debe de aparecer al principio de todo.
- cerrado: Indica si el thread esta cerrado.
- ipCreacion: IP de donde se creo el thread.
- usuario: Usuario que creo el thread.
- aliasTipo: Tipo de alias para los usuarios del thread, depende de cada Thread, es opcional.
- cantComentarios
*/