import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth as auth } from '../middlewares/auth.js';
import { register, login, me } from '../controllers/UsuarioController.js';
import validate from '../middlewares/validate.js';


const router = Router();

// === Rutas ===

// Registro
router.post(
  '/register',
  [
    body('nombre').notEmpty().withMessage('nombre requerido'),
    body('email').isEmail().withMessage('email inválido'),
    body('password').isLength({ min: 6 }).withMessage('mínimo 6 caracteres')
  ],
  validate,
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('email inválido'),
    body('password').notEmpty().withMessage('password requerido')
  ],
  validate,
  login
);

// Perfil actual (requiere token)
router.get('/me', auth, me);

export default router;
