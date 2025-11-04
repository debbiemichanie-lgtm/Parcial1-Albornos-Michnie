import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validate.js';
import {
  getEspecialistas,
  getById,
  create as createEspecialista,
  update as updateEspecialista,
  remove as deleteEspecialista,
} from '../controllers/EspecialistaController.js';

const router = Router();

router.get('/', getEspecialistas);
router.get('/:id', getById);

router.post(
  '/',
  [
    body('nombre').notEmpty().withMessage('nombre requerido'),
    body('profesion').notEmpty().withMessage('profesión requerida'),
    body('modality').isIn(['presencial','virtual','mixta']).withMessage('modality inválida'),
    body('insurance').isIn(['prepaga','particular','ambas']).withMessage('insurance inválida'),
    body('email').optional().isEmail().withMessage('email inválido'),
    body('specialties').optional().isArray().withMessage('specialties debe ser array'),
    body('city').optional().isString(),
    body('province').optional().isString(),
  ],
  validate,
  createEspecialista
);

router.put(
  '/:id',
  [
    body('nombre').optional().notEmpty(),
    body('profesion').optional().notEmpty(),
    body('modality').optional().isIn(['presencial','virtual','mixta']),
    body('insurance').optional().isIn(['prepaga','particular','ambas']),
    body('email').optional().isEmail(),
    body('specialties').optional().isArray(),
    body('city').optional().isString(),
    body('province').optional().isString(),
  ],
  validate,
  updateEspecialista
);

router.delete('/:id', deleteEspecialista);

export default router;
