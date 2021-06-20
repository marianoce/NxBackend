import { Document, Schema, Model, model, Error } from "mongoose";

export interface INotificacion extends Document {
  thread: Schema.Types.ObjectId;
  usuario: Schema.Types.ObjectId;
  comentario: Schema.Types.ObjectId;
}

export const notificacionSchema = new Schema({
    thread: {
        type: Schema.Types.ObjectId,
        ref: 'Thread',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    comentario: {
        type: Schema.Types.ObjectId,
        ref: 'Comentario',
        required: true
    }
});

export const Notificacion: Model<INotificacion> = model<INotificacion>("Notificacion", notificacionSchema);

/*
Son todos IDS
- thread: Thread al que se refiere.
- usuario: Usuario al que se tiene que notificar.
- comentario: Comentario que realiza el quote.
*/