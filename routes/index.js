import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import 'dotenv/config';

import EspecialistaRouter from './routes/EspecialistaRouter.js';
import UsuarioRouter from './routes/UsuarioRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

// estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// DB
(async () => {
  try {
    await mongoose.connect(process.env.URI_DB, { dbName: process.env.DB_NAME });
    console.log('✅ Mongo conectado');
  } catch (e) {
    console.error('❌ Error conectando a Mongo:', e.message);
    process.exit(1);
  }
})();

// API
app.use('/api/especialistas', EspecialistaRouter);
app.use('/api/auth', UsuarioRouter);

// home (sirve el index.html)
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// error handler (SIEMPRE al final)
app.use(errorHandler);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`OK http://localhost:${PORT}`));
