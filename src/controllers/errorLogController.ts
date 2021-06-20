import { Log } from "../models/Log";

export default class LogController {

    public async add(fecha: Date, origen: String, mensaje: String) {
        try {
            let newLog = new Log();
            newLog.fecha = fecha;
            newLog.origen = origen;
            newLog.mensaje = mensaje;
            newLog.save();
        } catch (error) {
            console.log('LogErrorException: ' + error);
        }
    }

}