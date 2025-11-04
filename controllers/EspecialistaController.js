// controllers/EspecialistaController.js
import Especialista from '../models/EspecialistaModel.js';
import ApiError from '../utils/ApiError.js';

// GET /api/especialistas
export async function getEspecialistas(req, res, next) {
  try {
    const { modality, insurance, specialty, city, province, q } = req.query;

    const filter = {};

    if (modality)  filter.modality  = modality;
    if (insurance) filter.insurance = insurance;
    if (specialty) filter.specialties = { $in: [specialty] };
    if (city)      filter.city     = new RegExp(req.query.city, 'i');
    if (province)  filter.province = new RegExp(req.query.province, 'i');

    // Búsqueda libre SIN $text (evita necesidad de índice de texto)
    if (q && q.trim()) {
      const rx = new RegExp(q.trim(), 'i');
      filter.$or = [
        { nombre: rx },
        { profesion: rx },
        { city: rx },
        { province: rx },
        { specialties: rx }, // matchea si alguna specialty contiene q
      ];
    }

    const docs = await Especialista.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ total: docs.length, data: docs });
  } catch (e) { next(e); }
}

// GET /api/especialistas/:id
export async function getById(req, res, next) {
  try {
    const doc = await Especialista.findById(req.params.id).lean();
    if (!doc) throw new ApiError(404, 'Especialista no encontrado');
    res.json({ data: doc });
  } catch (e) { next(e); }
}

// POST /api/especialistas
export async function create(req, res, next) {
  try {
    const doc = await Especialista.create(req.body);
    res.status(201).json({ data: doc });
  } catch (e) { next(e); }
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
  } catch (e) { next(e); }
}

// DELETE /api/especialistas/:id
export async function remove(req, res, next) {
  try {
    const doc = await Especialista.findByIdAndDelete(req.params.id).lean();
    if (!doc) throw new ApiError(404, 'Especialista no encontrado');
    res.json({ message: 'Eliminado' });
  } catch (e) { next(e); }
}
