const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs'),
  vm = require('node:vm'),
  path = require('node:path'),
  ts = require('typescript');
const root = path.resolve(__dirname, '..');
function php(code, env = {}) {
  return JSON.parse(
    execFileSync('php', ['-d', 'session.save_path=/tmp', '-r', code], {
      cwd: root,
      encoding: 'utf8',
      env: {
        ...process.env,
        MEDEINA_STRIPE_CONFIG: '/tmp/nonexistent-medeina-config.php',
        MEDEINA_STRIPE_PUBLIC_KEY: '',
        MEDEINA_STRIPE_SECRET_KEY: '',
        MEDEINA_PAYPAL_CONFIG: '/tmp/nonexistent-medeina-paypal-config.php',
        MEDEINA_PAYPAL_CLIENT_ID: '',
        MEDEINA_PAYPAL_SECRET: '',
        ...env,
      },
    }),
  );
}
const ctx = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync(path.join(root, 'src/app/store/store.data.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  ctx,
);
const prices = php('require "public/api/stripe-common.php"; echo json_encode(product_prices());');
for (const p of ctx.exports.storeProducts) {
  assert.equal(prices[p.id], p.priceCents);
  assert.equal(p.isExample, true);
}
assert.equal(Object.keys(prices).length, ctx.exports.storeProducts.length);
assert.deepEqual(php('$_SERVER["REQUEST_METHOD"]="GET"; require "public/api/stripe-config.php";'), {
  error: 'stripe_not_configured',
});
assert.deepEqual(
  php('$_SERVER["REQUEST_METHOD"]="GET"; require "public/api/stripe-config.php";', {
    MEDEINA_STRIPE_PUBLIC_KEY: 'pk_live_dummy',
  }),
  { error: 'stripe_not_configured' },
);
const config = php('$_SERVER["REQUEST_METHOD"]="GET"; require "public/api/stripe-config.php";', {
  MEDEINA_STRIPE_PUBLIC_KEY: 'pk_test_dummy',
  MEDEINA_STRIPE_SECRET_KEY: 'sk_test_private_dummy',
});
assert.equal(config.publishableKey, 'pk_test_dummy');
assert.match(config.csrfToken, /^[a-f0-9]{64}$/);
assert.equal(JSON.stringify(config).includes('sk_test_'), false);
for (const endpoint of [
  'create-payment-intent.php',
  'paypal-create-order.php',
  'paypal-capture-order.php',
]) {
  assert.deepEqual(
    php('$_SERVER["REQUEST_METHOD"]="GET"; require "public/api/' + endpoint + '";'),
    { error: 'method_not_allowed' },
  );
  assert.deepEqual(
    php(
      '$_SERVER["REQUEST_METHOD"]="POST"; $_SERVER["CONTENT_TYPE"]="application/json"; require "public/api/' +
        endpoint +
        '";',
    ),
    { error: 'invalid_session' },
  );
}
const paypal = php('$_SERVER["REQUEST_METHOD"]="GET"; require "public/api/paypal-config.php";');
assert.equal(paypal.clientId, 'sb');
assert.equal(paypal.configured, false);
assert.equal(paypal.sandbox, true);
assert.equal(
  php(
    'require "public/api/stripe-common.php"; echo json_encode([is_stripe_test_secret("rkcs_test_dummy"),is_stripe_test_secret("sk_live_dummy")]);',
  ).join(),
  'true,false',
);
assert.ok(
  fs
    .readFileSync(path.join(root, 'public/api/create-payment-intent.php'), 'utf8')
    .includes("'allowed_payment_method_types' => ['card']"),
);
assert.ok(
  fs
    .readFileSync(path.join(root, 'src/app/checkout/checkout.component.ts'), 'utf8')
    .includes("allowedPaymentMethodTypes: ['card']"),
);
console.log(
  'Stripe-/PayPal-Prüfungen erfolgreich: Preise, Testmodus, Sitzungsschutz und keine geheimen Schlüssel in API-Antworten.',
);
