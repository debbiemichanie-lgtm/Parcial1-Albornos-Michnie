// Base API: mismo host/puerto que sirvió el HTML
const API = `${location.origin}/api`;

// Refs comunes
const adminBox   = document.getElementById('adminBox');
const btnLogout  = document.getElementById('btnLogout');
const adminHint  = document.getElementById('adminHint');

const formCreate = document.getElementById('formCreate');
const createMsg  = document.getElementById('createMsg');

const f = {
  nombre:     document.getElementById('f_nombre'),
  profesion:  document.getElementById('f_profesion'),
  modality:   document.getElementById('f_modality'),
  insurance:  document.getElementById('f_insurance'),
  specialties:document.getElementById('f_specialties'),
  city:       document.getElementById('f_city'),
  province:   document.getElementById('f_province'),
  email:      document.getElementById('f_email')
};

const els = {
  q: document.querySelector('#q'),
  modality: document.querySelector('#modality'),
  insurance: document.querySelector('#insurance'),
  city: document.querySelector('#city'),
  btnSearch: document.querySelector('#btnSearch'),
  btnClear: document.querySelector('#btnClear'),
  cards: document.querySelector('#cards'),
  resultInfo: document.querySelector('#resultInfo'),
  dlgLogin: document.querySelector('#dlgLogin'),
  btnOpenLogin: document.querySelector('#btnOpenLogin'),
  loginEmail: document.querySelector('#loginEmail'),
  loginPass: document.querySelector('#loginPass'),
  btnDoLogin: document.querySelector('#btnDoLogin'),
  loginMsg: document.querySelector('#loginMsg'),
};

let token = localStorage.getItem('token') || '';

// ===== Helpers =====
function buildQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && String(v).trim() !== '') qs.set(k, v.trim());
  });
  return qs.toString();
}

async function apiGet(path, params = {}) {
  const qs = buildQuery(params);
  const url = qs ? `${API}${path}?${qs}` : `${API}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

async function apiPost(path, data, needAuth = false) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(needAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.ok === false) {
    throw new Error(json.message || `POST ${path} error (${res.status})`);
  }
  return json;
}

// ===== Render =====
function specialistCard(s) {
  const specs = (s.specialties || []).map(x => `<span class="badge">${x}</span>`).join('');
  return `
    <article class="card">
      <h4>${s.nombre}</h4>
      <p>${s.profesion} • <span class="badge">${s.modality}</span> • <span class="badge">${s.insurance}</span></p>
      <p>${s.city || ''}${s.city && s.province ? ', ' : ''}${s.province || ''}</p>
      <div class="badges">${specs}</div>
      ${s.email ? `<div class="cta"><a href="mailto:${s.email}" class="btn small outline">Contactar</a></div>` : ''}
    </article>
  `;
}

function renderList(payload) {
  // backend esperado: { total, data } o { ok, total, data }
  const total = payload.total ?? (Array.isArray(payload.data) ? payload.data.length : 0);
  const data  = payload.data ?? [];
  els.resultInfo.textContent = `Resultados: ${total}`;
  els.cards.innerHTML = data.length
    ? data.map(specialistCard).join('')
    : `<p class="muted">No se encontraron especialistas con esos filtros.</p>`;
}

// ===== Actions =====
async function doSearch() {
  try {
    els.resultInfo.textContent = 'Cargando...';
    const params = {
      q: els.q.value,
      modality: els.modality.value,
      insurance: els.insurance.value,
      city: els.city.value,
    };
    const resp = await apiGet('/especialistas', params);
    renderList(resp);
  } catch (err) {
    console.error(err);
    els.resultInfo.textContent = 'Error al cargar.';
    els.cards.innerHTML = '';
  }
}

function clearFilters() {
  els.q.value = '';
  els.modality.value = '';
  els.insurance.value = '';
  els.city.value = '';
  doSearch();
}

// ===== Login / Logout =====
function openLogin() { els.dlgLogin.showModal(); }
function closeLogin() { els.dlgLogin.close(); }

async function doLogin() {
  els.loginMsg.textContent = 'Autenticando...';
  try {
    const { token: t } = await apiPost('/auth/login', {
      email: els.loginEmail.value.trim(),
      password: els.loginPass.value.trim(),
    });
    token = t;
    localStorage.setItem('token', t);
    renderAuthUI();
    els.loginMsg.textContent = 'Login OK ✅';
    setTimeout(closeLogin, 600);
  } catch (e) {
    els.loginMsg.textContent = 'Credenciales inválidas';
  }
}

function renderAuthUI() {
  const hasToken = !!localStorage.getItem('token');
  adminBox?.classList.toggle('hidden', !hasToken);
  btnLogout?.classList.toggle('hidden', !hasToken);
  adminHint?.classList.toggle('hidden', hasToken);
}

btnLogout?.addEventListener('click', () => {
  localStorage.removeItem('token');
  token = '';
  renderAuthUI();
});

// ===== Crear especialista =====
async function onCreateSpecialist(e) {
  e.preventDefault();
  createMsg.textContent = '';

  const specialtiesArr = f.specialties.value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const body = {
    nombre:    f.nombre.value.trim(),
    profesion: f.profesion.value.trim(),
    modality:  f.modality.value,
    insurance: f.insurance.value,
    specialties: specialtiesArr,
    city:      f.city.value.trim(),
    province:  f.province.value.trim(),
    email:     f.email.value.trim()
  };

  try {
    await apiPost('/especialistas', body, true);
    createMsg.textContent = '✔ Creado';
    createMsg.style.color = 'limegreen';

    // Limpiar (dejamos selects)
    ['nombre','profesion','specialties','city','province','email'].forEach(k => f[k].value = '');

    await doSearch();
  } catch (err) {
    createMsg.textContent = '✖ ' + (err?.message || 'Error al crear');
    createMsg.style.color = 'tomato';
  }
}

// ===== Events =====
els.btnSearch.addEventListener('click', doSearch);
els.btnClear.addEventListener('click', clearFilters);

['q','modality','insurance','city'].forEach(id => {
  document.querySelector('#'+id).addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });
});

els.btnOpenLogin.addEventListener('click', openLogin);
els.btnDoLogin.addEventListener('click', doLogin);
formCreate.addEventListener('submit', onCreateSpecialist);

// Init
renderAuthUI();
doSearch();
