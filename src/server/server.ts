import express, { Request, Response } from "express";
import cors from 'cors';
import path = require('path');
import AuthRouter from '../routes/authRouter';
import ThreadRouter from '../routes/threadRouter';
import UploadRouter from '../routes/uploadRouter';
import ConfigRouter from '../routes/configRouter';
import obtenerIP from '../middlewares/obtener-ip';

export default class Server {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.port = port;
        this.app = express();
    }

    static init(port: number) {
        return new Server(port);
    }

    start(callback: () => void) {
        const publicPath = path.resolve(__dirname, '../public');

        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static(publicPath));

        //Rutas
        this.app.use(obtenerIP);
        this.app.use('/api/auth', AuthRouter);
        this.app.use('/api/thread', ThreadRouter);
        this.app.use('/api/upload', UploadRouter);
        this.app.use('/api/config', ConfigRouter);

        this.app.listen(this.port, callback);
    }
}