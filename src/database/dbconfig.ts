import mongoose = require('mongoose');
import { usuarioSchema } from '../models/Usuario';
import { comentarioSchema } from '../models/Comentario';
import { logSchema } from '../models/Log';
import { threadSchema } from '../models/Thread';
import { aliasSchema } from '../models/Alias';
import { notificacionSchema } from '../models/Notificaciones';
import { configUsuarioCategoriaSchema } from '../models/ConfigUsuarioCategoria';

export default class DBConn {
    private connectionString: string;
    private connection: any;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    public connect = async() => {
        try {
            this.connection = mongoose.Connection;
            
            mongoose.connect(this.connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                connectTimeoutMS: 3000
            });
            
            console.log('Conexion a la base de datos establecida');

            const models = {
              Usuario: mongoose.model('Usuario', usuarioSchema),
              Comentario: mongoose.model('Comentario', comentarioSchema),
              Log: mongoose.model('Log', logSchema),
              Thread: mongoose.model('Thread', threadSchema),
              Alias: mongoose.model('Alias', aliasSchema),
              Notificacion: mongoose.model('Notificacion', notificacionSchema),
              ConfigUsuarioCategoria: mongoose.model('ConfigUsuarioCategoria', configUsuarioCategoriaSchema)
            };
            
            
            // explicitly create each collection
            // for Mongoose multi-document write support which is needed for transactions
            Object.values(models).forEach(model => {
              model.createCollection();
            });
            

            /*
            //Conexion exitosa
            this.connection.on("connected", () => {
                console.log('Conexion a la base de datos establecida');
            });
    
            //Si se pierde la conexion, en caso de que se reconecte
            this.connection.on("reconnected", () => {
                console.log('Conexion a la base de datos RE-establecida');
            });
    
            //Si se pierde la conexion, en caso de que se reconecte
            this.connection.on("disconnected", () => {
                console.log('Perdida la conexion a la base de datos');
                console.log('Tratando de reconectar....');
                setTimeout(() => {
                    mongoose.connect(this.connectionString, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useCreateIndex: true,
                        autoReconnect: true,
                        connectTimeoutMS: 3000
                    });
                }, 3000);
            });
            */
        } catch (error) {
            console.log('Error en conexion a DBase: ' + error);
            throw new Error('Error en conexion a DBase: ' + error);
        }
    }
}