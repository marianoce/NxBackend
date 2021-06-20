import { Router } from 'express';
import { check } from 'express-validator';

//Middlewares
import validarJWT from '../middlewares/validar-jwt';
import validarCampos from '../middlewares/validar-campos';

//Controladoras
import ConfigController from '../controllers/configController';

const ConfigRouter = Router();
const configController = new ConfigController();


ConfigRouter.put('/usuarioCategoria', [
            check('categorias', 'No se enviaron las categorias').exists(),
            validarCampos
], validarJWT, configController.updateUsuarioCategoria);


ConfigRouter.get('/usuarioCategoria', validarJWT, configController.getUsuarioCategoria);


export default ConfigRouter;