import { Document, Schema, Model, model, Error } from "mongoose";

export interface ILog extends Document {
  fecha: Date;
  origen: String;
  mensaje: String;
}

export const logSchema = new Schema({
    fecha: {
        type: Date,
        required: true,
    },
    origen: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    }
});

export const Log: Model<ILog> = model<ILog>("Log", logSchema);

/*
Es un log de errores con la info.
*/