import { Request, Response } from "express";
import { cloudinaryUpload } from '../helpers/fileHandler';

export default class UploadController {

    public subirImagen(req: Request, res: Response) {
        if (!req.files) {
            return res.status(400).json({
                ok: false,
                msg: 'No envio archivo'
            });
        }

        cloudinaryUpload(req.files.file.data, req.files.file.mimetype).then((result:any) => {
            return res.status(200).json({
                ok: false,
                url: result.url,
                idFile: result.public_id
            });            
        }).catch((err: any) => {
            console.log(err);
            return res.status(400).json({
                ok: false,
                msg: 'Error al subir archivo: ' + err
            });
        });
    }
}