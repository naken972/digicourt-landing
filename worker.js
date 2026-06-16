/**
 * DigiCourt Worker
 * - Sert les fichiers statiques (assets)
 * - POST /api/signup  → incrémente KV + forward Formspree
 * - GET  /api/count   → retourne le compteur actuel
 */

const FORMSPREE_URL = 'https://formspree.io/f/mpqnkawk';
const INITIAL_COUNT = 47; // valeur de départ (inscriptions déjà collectées)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* ── GET /api/count ── */
    if (url.pathname === '/api/count' && request.method === 'GET') {
      const raw = await env.DC_KV.get('signup_count');
      const count = raw !== null ? parseInt(raw, 10) : INITIAL_COUNT;
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

      // Incrémenter le compteur
      const raw = await env.DC_KV.get('signup_count');
      const current = raw !== null ? parseInt(raw, 10) : INITIAL_COUNT;
      const newCount = current + 1;
      await env.DC_KV.put('signup_count', String(newCount));

      // Forwarder vers Formspree (best-effort, ne bloque pas la réponse)
      try {
        await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch {
        // Formspree down → on ignore, le compteur est déjà incrémenté
      }

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
