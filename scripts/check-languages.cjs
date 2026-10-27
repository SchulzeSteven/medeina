const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Execute data-only TypeScript modules without loading Angular or contacting a service.
function loadData(file) {
  const source = fs.readFileSync(path.join(__dirname, '..', 'src/app', file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const module = { exports: {} };
  new Function('module', 'exports', outputText)(module, module.exports);
  return module.exports;
}

function checkShape(reference, translated, location) {
  if (typeof reference === 'string') {
    assert.equal(typeof translated, 'string', location);
    assert.ok(translated.trim(), `${location} must not be empty`);
  } else if (Array.isArray(reference)) {
    assert.equal(translated.length, reference.length, location);
    reference.forEach((value, index) =>
      checkShape(value, translated[index], `${location}[${index}]`),
    );
  } else if (reference && typeof reference === 'object') {
    assert.deepEqual(Object.keys(translated).sort(), Object.keys(reference).sort(), location);
    for (const key of Object.keys(reference))
      checkShape(reference[key], translated[key], `${location}.${key}`);
  }
}

function checkLocalized(value, location) {
  if (!value || typeof value !== 'object') return;
  if ('de' in value && 'tr' in value) {
    checkShape(value.de, value.en, `${location}.en`);
    return;
  }
  for (const [key, child] of Object.entries(value)) checkLocalized(child, `${location}.${key}`);
}

const { translations } = loadData('translations.ts');
for (const language of ['tr', 'en']) {
  checkShape(translations.de, translations[language], `translations.${language}`);
  assert.deepEqual(
    translations[language].offers.map(({ id, image }) => ({ id, image })),
    translations.de.offers.map(({ id, image }) => ({ id, image })),
    'Offer IDs and image paths must stay independent of language',
  );
}
assert.match(translations.en.englishSupportText, /interpreter/);
assert.match(translations.en.englishSupportText, /Additional interpreting fees/);
assert.match(translations.en.englishSupportText, /before booking/);

for (const file of [
  'catalog/catalog.data.ts',
  'catalog/catalog-guidance.ts',
  'store/store.data.ts',
  'legal/imprint.data.ts',
  'legal/privacy.data.ts',
])
  checkLocalized(loadData(file), file);

const header = fs.readFileSync(
  path.join(__dirname, '../src/app/header/header.component.html'),
  'utf8',
);
assert.match(header, /state\.setLanguage\('en'\)/);
console.log(
  'DE/TR/EN content coverage, offer identity, English switch and interpreting notice passed.',
);
