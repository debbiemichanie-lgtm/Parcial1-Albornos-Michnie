import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import EspecialistaRouter from './routes/EspecialistaRouter.js';
import UsuarioRouter from './routes/UsuarioRouter.js'; // <- auth

const app = express();

app.use(cors());
app.use(express.json());

// estáticos (tu index.html y app.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use('/api/especialistas', EspecialistaRouter);
app.use('/api/auth', UsuarioRouter);

// home
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(process.env.PORT || 5050, () =>
  console.log('OK http://localhost:5050')
);
