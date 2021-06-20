import { Router } from 'express';

//Middlewares
import validarJWT from '../middlewares/validar-jwt';

//Controladoras
import UploadController from '../controllers/uploadController';
const uploadController = new UploadController();

const fileUpload = require('express-fileupload');
const UploadRouter = Router();

UploadRouter.use(fileUpload());

UploadRouter.post('/', validarJWT, uploadController.subirImagen);

export default UploadRouter;