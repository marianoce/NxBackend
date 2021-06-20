import { Router } from 'express';
import { check } from 'express-validator';

//Middlewares
import validarJWT from '../middlewares/validar-jwt';
import validarCampos from '../middlewares/validar-campos';

//Controladoras
import ThreadController from '../controllers/threadController';

const ThreadRouter = Router();
const threadController = new ThreadController();


ThreadRouter.post('/nuevo', [
            check('titulo', 'El titulo es obligatorio').notEmpty(),
            check('titulo', 'El titulo debe de tener 6 caracteres como minimo').isLength({ min: 5 }),
            check('titulo', 'El titulo es demasiado largo').isLength({ max: 85 }),
            check('contenido', 'El contenido debe de ser de 6 caracteres como minimo').isLength({ min: 5 }),
            check('contenido', 'El contenido es demasiado largo').isLength({ max: 1300 }),
            check('aliasTipo', 'El alias tipo es obligatoria').notEmpty(),
            check('categoria', 'La categoria es obligatoria').notEmpty(),
            check('img', 'La imagen es obligatoria').notEmpty(),
            validarCampos
], validarJWT, threadController.newThread);

ThreadRouter.get('/:id', threadController.getThread);

ThreadRouter.get('/', threadController.getListado);

ThreadRouter.post('/comentario', [
    check('contenido', 'El contenido es obligatorio').notEmpty(),
    check('contenido', 'El contenido es demasiado largo').isLength({ max: 1300 }),
    check('thread', 'El thread es invalido').isMongoId()
], validarJWT, threadController.comentarThread);


export default ThreadRouter;