import { Document, Schema, Model, model, Error } from "mongoose";
import { CategoriasValidas } from './Categoria';

export interface IConfigUsuarioCategoria extends Document {
  usuario: Schema.Types.ObjectId;
  categorias: String[];
}

export const configUsuarioCategoriaSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categorias: {
        type: [String],
        required: true,
        enum: CategoriasValidas
    }
});

export const ConfigUsuarioCategoria: Model<IConfigUsuarioCategoria> = model<IConfigUsuarioCategoria>("ConfigUsuarioCategoria", configUsuarioCategoriaSchema);
