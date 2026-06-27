/**
 * DigiCourt Worker
 * - Sert les fichiers statiques (assets)
 * - POST /api/signup  → forward Formspree + incrémente KV + envoie email Resend
 * - GET  /api/count   → retourne le compteur KV (ou valeur initiale)
 */

const FORMSPREE_URL  = 'https://formspree.io/f/mpqnkawk';
const RESEND_API     = 'https://api.resend.com/emails';
const FROM_ADDRESS   = 'DigiCourt <onboarding@resend.dev>';
const REPLY_TO       = 'digicourtcapi@gmail.com';
const SUBJECT        = '🎾 Vous êtes en avant-première — Offre Early Supporter DigiCourt';
const CTA_MAILTO     = 'mailto:digicourtcapi@gmail.com?subject=Commande%20DigiCourt%20Early%20Supporter';
const INITIAL_COUNT  = 2;

function buildEmailHtml() {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

        <tr>
          <td style="background:#00112e;padding:36px 40px 28px;text-align:center;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:0.12em;color:#d4f70c;text-transform:uppercase;">DigiCourt</p>
            <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;line-height:1.25;">Vous êtes en avant&#8209;première 🎾</h1>
            <p style="margin:14px 0 0;font-size:15px;color:rgba(255,255,255,0.55);">Merci d'avoir manifesté votre intérêt pour DigiCourt.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            <p style="margin:0 0 20px;font-size:15px;color:#333;line-height:1.65;">Bonjour,</p>
            <p style="margin:0 0 20px;font-size:15px;color:#333;line-height:1.65;">
              Vous avez récemment manifesté votre intérêt pour DigiCourt, et nous ne l'avons pas oublié.<br>
              Aujourd'hui, nous lançons notre toute première campagne de commande et vous en faites partie en <strong>avant-première</strong>.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#00112e;border-radius:12px;margin:0 0 20px;">
              <tr><td style="padding:24px 28px;">
                <p style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:0.1em;color:#d4f70c;text-transform:uppercase;">🏆 Offre Early Supporter</p>
                <p style="margin:0 0 10px;font-size:16px;font-weight:700;color:#ffffff;line-height:1.45;">Soyez parmi les premiers à avoir la V1 de DigiCourt</p>
                <p style="margin:0 0 10px;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.6;">Le seul compteur de point sans fil pensé par des joueurs, pour des joueurs.</p>
                <p style="margin:0;font-size:15px;color:#ffffff;line-height:1.6;">
                  ✅ <strong>Prix spécial early supporter : 159€ au lieu de 199€</strong><br>
                  <span style="color:rgba(255,255,255,0.6);font-size:13px;">C'est notre façon de vous remercier de nous faire confiance dès le début.</span>
                </p>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#004aad;border-radius:12px;margin:0 0 28px;">
              <tr><td style="padding:24px 28px;">
                <p style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:0.1em;color:#d4f70c;text-transform:uppercase;">📸 Offre Bonus Contenu</p>
                <p style="margin:0 0 10px;font-size:16px;font-weight:700;color:#ffffff;line-height:1.45;">Et ce n'est pas tout — une deuxième offre s'ajoute</p>
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.65;">
                  Commandez à 159€ et recevez un <strong>remboursement de 20€ supplémentaire</strong> si vous nous envoyez des photos ou vidéos de DigiCourt en action pendant vos parties.<br><br>
                  Vos contenus nous aident à faire connaître DigiCourt sur Instagram, TikTok et Facebook.
                </p>
              </td></tr>
            </table>

            <p style="margin:0 0 28px;font-size:15px;color:#333;line-height:1.65;">
              Pour commander, <strong>répondez simplement à ce mail</strong> ou cliquez sur le bouton ci-dessous.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${CTA_MAILTO}" style="display:inline-block;background:#d4f70c;color:#00112e;text-decoration:none;font-size:16px;font-weight:900;padding:16px 36px;border-radius:8px;letter-spacing:0.02em;">
                  Je commande à 159€ 🎾
                </a>
              </td></tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#f4f4f8;padding:24px 40px;text-align:center;border-top:1px solid #e0e0e8;">
            <p style="margin:0 0 6px;font-size:14px;color:#555;line-height:1.6;">
              Merci de faire partie de l'aventure DigiCourt.<br>
              <strong>Many &amp; Jules</strong> — Équipe DigiCourt
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#999;">
              Vous recevez cet email car vous avez rempli le formulaire d'intérêt sur
              <a href="https://digicourt.fr" style="color:#004aad;text-decoration:none;">digicourt.fr</a>.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendWelcomeEmail(email, resendKey) {
  if (!resendKey) return;
  try {
    await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:     FROM_ADDRESS,
        reply_to: REPLY_TO,
        to:       [email],
        subject:  SUBJECT,
        html:     buildEmailHtml(),
      }),
    });
  } catch { /* Email down → pas bloquant */ }
}

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
      try {
        const fRes = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch { /* Formspree down → on continue quand même */ }

      // 2. Incrémenter le compteur KV
      let newCount = INITIAL_COUNT;
      try {
        const raw = await env.DC_KV.get('signup_count');
        const current = raw !== null ? parseInt(raw, 10) : INITIAL_COUNT;
        newCount = current + 1;
        await env.DC_KV.put('signup_count', String(newCount));
      } catch { /* KV pas encore dispo → pas grave */ }

      // 3. Envoyer l'email de bienvenue via Resend (non bloquant)
      await sendWelcomeEmail(email, env.RESEND_API_KEY);

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
