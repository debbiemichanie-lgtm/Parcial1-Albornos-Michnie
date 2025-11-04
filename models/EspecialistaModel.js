// models/EspecialistaModel.js
import mongoose from 'mongoose';

const EspecialistaSchema = new mongoose.Schema(
  {
    nombre:     { type: String, required: true, trim: true },
    profesion:  { type: String, required: true, trim: true },
    modality:   { type: String, required: true, enum: ['presencial', 'virtual', 'mixta'] },
    insurance:  { type: String, required: true, enum: ['prepaga', 'particular', 'ambas'] },
    specialties:{ type: [String], default: [] },
    city:       { type: String, default: '' },
    province:   { type: String, default: '' },
    email:      { type: String, default: '', trim: true, lowercase: true },
  },
  { timestamps: true }
);

// Para búsqueda por texto (q)
EspecialistaSchema.index({
  nombre: 'text',
  profesion: 'text',
  city: 'text',
  province: 'text',
  specialties: 'text',
});

export default mongoose.model('Especialista', EspecialistaSchema);

import Especialista from '../models/EspecialistaModel.js';
import ApiError from '../utils/ApiError.js';

// GET /api/especialistas
export async function getEspecialistas(req, res, next) {
  try {
    const { modality, insurance, specialty, city, province, q } = req.query;
    const filter = {};

    if (modality)  filter.modality   = modality;
    if (insurance) filter.insurance  = insurance;
    if (specialty) filter.specialties = { $in: [specialty] };
    if (city)      filter.city       = new RegExp(`^${city}$`, 'i');
    if (province)  filter.province   = new RegExp(`^${province}$`, 'i');
    if (q)         filter.$text      = { $search: q };

    const docs = await Especialista.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ total: docs.length, data: docs });
  } catch (e) {
    next(e);
  }
}

// GET /api/especialistas/:id
export async function getById(req, res, next) {
  try {
    const doc = await Especialista.findById(req.params.id).lean();
    if (!doc) throw new ApiError(404, 'Especialista no encontrado');
    res.json({ data: doc });
  } catch (e) {
    next(e);
  }
}

// POST /api/especialistas
export async function create(req, res, next) {
  try {
    const doc = await Especialista.create(req.body);
    res.status(201).json({ data: doc });
  } catch (e) {
    next(e);
  }
}

// PUT /api/especialistas/:id
export async function update(req, res, next) {
  try {
    const doc = await Especialista.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();
    if (!doc) throw new ApiError(404, 'Especialista no encontrado');
    res.json({ data: doc });
  } catch (e) {
    next(e);
  }
}

// DELETE /api/especialistas/:id
export async function remove(req, res, next) {
  try {
    const doc = await Especialista.findByIdAndDelete(req.params.id).lean();
    if (!doc) throw new ApiError(404, 'Especialista no encontrado');
    res.json({ message: 'Eliminado' });
  } catch (e) {
    next(e);
  }
}
