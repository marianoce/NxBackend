import { Router } from 'express';
import { check } from 'express-validator';

//Middlewares
import validarJWT from '../middlewares/validar-jwt';
import validarCampos from '../middlewares/validar-campos';

//Controladoras
import AuthController from '../controllers/authController';

const AuthRouter = Router();
const authController = new AuthController();

AuthRouter.post('/nuevo', [
            check('email', 'El email es obligatorio').notEmpty(),
            check('email', 'El email es incorrecto').isEmail(),
            check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 5 }),
            validarCampos
], authController.newUsuario);


AuthRouter.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 5 }),
    validarCampos
], authController.loginUsuario);

AuthRouter.get('/renuevo', validarJWT, authController.revalidarToken);


export default AuthRouter;