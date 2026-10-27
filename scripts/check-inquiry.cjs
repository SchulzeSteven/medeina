const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { randomUUID } = require('node:crypto');

const endpoint = new URL(
  '/api/send-inquiry.php',
  process.argv.find((argument) => argument.startsWith('http')) ||
    process.env.MEDEINA_TEST_URL ||
    'http://127.0.0.1:8081',
);

async function main() {
  const session = await fetch(endpoint);
  assert.equal(session.status, 200);
  assert.match(session.headers.get('content-type') || '', /application\/json/);
  const { token } = await session.json();
  assert.match(token, /^[a-f0-9]{64}$/);
  const cookie = session.headers.get('set-cookie')?.split(';')[0];
  assert.ok(cookie, 'The API must establish an HTTP-only session.');
  assert.match(session.headers.get('set-cookie'), /httponly/i);

  const inquiry = {
    name: 'Steven – Formulartest',
    email: 'schulze89@hotmail.de',
    interest: 'Kostenloses Erstgespräch',
    message:
      'Dies ist ein Test über das Anfrageformular. Bitte das Mainlogo und die Darstellung prüfen.',
    language: 'de',
    requestId: randomUUID(),
  };

  const post = (body, csrf = token) =>
    fetch(endpoint, {
      method: 'POST',
      headers: {
        Cookie: cookie,
        'Content-Type': 'application/json',
        'X-Inquiry-Token': csrf,
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });

  assert.equal((await post(inquiry, 'incorrect')).status, 403);
  assert.equal((await post({ ...inquiry, email: 'not-an-email' })).status, 422);
  assert.equal((await post({ ...inquiry, name: '' })).status, 422);
  assert.equal((await post({ ...inquiry, message: 'a'.repeat(5001) })).status, 422);
  assert.equal((await post({ ...inquiry, language: 'xx' })).status, 422);
  assert.equal((await post('{invalid-json')).status, 400);
  assert.equal((await post('a'.repeat(32769))).status, 413);
  assert.equal((await fetch(endpoint, { method: 'DELETE' })).status, 405);

  for (const language of ['de', 'tr', 'en']) {
    const fields = { ...inquiry, language, name: '<script>alert(1)</script> Çağla & Steven' };
    const rendered = JSON.parse(
      execFileSync(
        'php',
        [
          '-r',
          "require 'public/api/inquiry-email.php'; echo json_encode(inquiry_email(json_decode(stream_get_contents(STDIN), true)));",
        ],
        { input: JSON.stringify(fields), encoding: 'utf8' },
      ),
    );
    assert.ok(rendered.html.includes('cid:medeina-logo'));
    assert.ok(rendered.html.includes('&lt;script&gt;'));
    assert.ok(!rendered.html.includes('<script>'));
    assert.ok(rendered.html.includes('Çağla &amp; Steven'));
    assert.ok(rendered.text.includes(fields.message));
    const languageName = { de: 'Deutsch (DE)', tr: 'Türkisch (TR)', en: 'Englisch (EN)' }[language];
    assert.equal(rendered.subject, `Medeina · Neue Anfrage · ${languageName}`);
    assert.ok(rendered.html.includes(`<strong>Website-Sprache:</strong> ${languageName}`));
    assert.ok(rendered.text.includes(`Website-Sprache: ${languageName}`));
    assert.ok(
      rendered.html.includes(
        {
          de: 'Eine neue Anfrage ist da.',
          tr: 'Yeni bir talep var.',
          en: 'A new enquiry has arrived.',
        }[language],
      ),
    );
  }

  console.log('Session, validation, size limits and DE/TR/EN email rendering passed.');

  if (process.argv.includes('--send-live')) {
    const response = await post(inquiry);
    const result = await response.json();
    assert.equal(response.status, 200, JSON.stringify(result));
    assert.equal(result.sent, true);
    const retry = await post(inquiry);
    assert.equal(retry.status, 200);
    assert.equal((await retry.json()).sent, true);
    console.log('Resend accepted the test inquiry and its idempotent retry.');
  } else {
    console.log('No emails sent. Add --send-live to explicitly test delivery.');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
