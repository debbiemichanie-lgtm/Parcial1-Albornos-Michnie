// middlewares/auth.js
import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ ok:false, message:'Token requerido' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ ok:false, message:'Token inválido' });
  }
}

// opcional, por compatibilidad
export default requireAuth;
