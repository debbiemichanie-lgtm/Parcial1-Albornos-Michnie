import { validationResult } from 'express-validator';

export default function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      ok: false, 
      message: errors.array()[0].msg, 
      errors: errors.array() 
    });
  }
  next();
}
