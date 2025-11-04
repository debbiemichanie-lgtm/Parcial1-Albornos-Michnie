import { Router } from 'express';
import { body, param, query } from 'express-validator';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';


import { list, getById, create, update, remove } from '../controllers/EspecialidadController.js';

const router = Router();

// Listar (con búsqueda opcional ?q=)
router.get(
  '/',
  [query('q').optional().isString().withMessage('q debe ser texto')],
  validate,
  list
);

// Obtener por ID
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('id inválido')],
  validate,
  getById
);

// Crear (protegido)
router.post(
  '/',
  auth,
  [body('nombre').notEmpty().withMessage('nombre requerido'),
   body('descripcion').optional().isString().withMessage('descripcion inválida')],
  validate,
  create
);

// Actualizar (protegido)
router.put(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('id inválido'),
    body('nombre').optional().notEmpty().withMessage('nombre inválido'),
    body('descripcion').optional().isString().withMessage('descripcion inválida')
  ],
  validate,
  update
);

// Eliminar (protegido)
router.delete(
  '/:id',
  auth,
  [param('id').isMongoId().withMessage('id inválido')],
  validate,
  remove
);

export default router;
