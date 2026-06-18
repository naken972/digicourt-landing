/**
 * DigiCourt Worker
 * - Sert les fichiers statiques (assets)
 * - POST /api/signup  → forward Formspree + incrémente KV (optionnel)
 * - GET  /api/count   → retourne le compteur KV (ou valeur initiale)
 */

const FORMSPREE_URL = 'https://formspree.io/f/mpqnkawk';
const INITIAL_COUNT = 2;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* ── GET /api/count ── */
    if (url.pathname === '/api/count' && request.method === 'GET') {
      let count = INITIAL_COUNT;
      try {
        const raw = await env.DC_KV.get('signup_count');
        if (raw !== null) count = parseInt(raw, 10);
      } catch { /* KV pas encore dispo → valeur initiale */ }
      return json({ count });
    }

    /* ── POST /api/signup ── */
    if (url.pathname === '/api/signup' && request.method === 'POST') {
      let email;
      try {
        const body = await request.json();
        email = (body.email || '').trim().toLowerCase();
      } catch {
        return json({ error: 'Corps invalide' }, 400);
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ error: 'Email invalide' }, 400);
      }

      // 1. Forwarder vers Formspree EN PREMIER (priorité absolue)
      let formspreeOk = false;
      try {
        const fRes = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email }),
        });
        formspreeOk = fRes.ok;
      } catch { /* Formspree down → on continue quand même */ }

      // 2. Incrémenter le compteur KV (optionnel, ne bloque pas)
      let newCount = INITIAL_COUNT;
      try {
        const raw = await env.DC_KV.get('signup_count');
        const current = raw !== null ? parseInt(raw, 10) : INITIAL_COUNT;
        newCount = current + 1;
        await env.DC_KV.put('signup_count', String(newCount));
      } catch { /* KV pas encore dispo → pas grave */ }

      return json({ ok: true, count: newCount });
    }

    /* ── Tout le reste → fichiers statiques ── */
    return env.ASSETS.fetch(request);
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
