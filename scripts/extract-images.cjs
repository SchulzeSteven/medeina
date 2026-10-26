// Extract the photographic assets from the supplied layout; no external packages needed.
const fs = require('node:fs');
const zlib = require('node:zlib');
const data = fs.readFileSync('layout.png');
const w = data.readUInt32BE(16),
  h = data.readUInt32BE(20);
if (data[24] !== 8 || data[25] !== 2 || data[28] !== 0)
  throw new Error('Expected non-interlaced RGB PNG');
const blocks = [];
for (let p = 8; p < data.length;) {
  const n = data.readUInt32BE(p);
  if (data.toString('ascii', p + 4, p + 8) === 'IDAT') blocks.push(data.subarray(p + 8, p + 8 + n));
  p += n + 12;
}
const raw = zlib.inflateSync(Buffer.concat(blocks)),
  pixels = Buffer.alloc(w * h * 3),
  stride = w * 3;
const paeth = (a, b, c) => {
  const p = a + b - c,
    pa = Math.abs(p - a),
    pb = Math.abs(p - b),
    pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};
for (let y = 0; y < h; y++) {
  const f = raw[y * (stride + 1)];
  for (let x = 0; x < stride; x++) {
    const a = x >= 3 ? pixels[y * stride + x - 3] : 0,
      b = y ? pixels[(y - 1) * stride + x] : 0,
      c = y && x >= 3 ? pixels[(y - 1) * stride + x - 3] : 0;
    pixels[y * stride + x] =
      (raw[y * (stride + 1) + x + 1] +
        (f === 0
          ? 0
          : f === 1
            ? a
            : f === 2
              ? b
              : f === 3
                ? Math.floor((a + b) / 2)
                : paeth(a, b, c))) &
      255;
  }
}
function crc(b) {
  let c = 0xffffffff;
  for (const v of b) {
    c ^= v;
    for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
  }
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, b) {
  const t = Buffer.from(type),
    o = Buffer.alloc(b.length + 12);
  o.writeUInt32BE(b.length);
  t.copy(o, 4);
  b.copy(o, 8);
  o.writeUInt32BE(crc(Buffer.concat([t, b])), b.length + 8);
  return o;
}
function crop(name, x, y, cw, ch) {
  const rows = Buffer.alloc((cw * 3 + 1) * ch);
  for (let i = 0; i < ch; i++)
    pixels.copy(rows, i * (cw * 3 + 1) + 1, ((y + i) * w + x) * 3, ((y + i) * w + x + cw) * 3);
  const ih = Buffer.alloc(13);
  ih.writeUInt32BE(cw);
  ih.writeUInt32BE(ch, 4);
  ih[8] = 8;
  ih[9] = 2;
  fs.writeFileSync(
    `public/images/${name}.png`,
    Buffer.concat([
      data.subarray(0, 8),
      chunk('IHDR', ih),
      chunk('IDAT', zlib.deflateSync(rows)),
      chunk('IEND', Buffer.alloc(0)),
    ]),
  );
}
crop('logo', 65, 9, 180, 45);
crop('hero', 500, 63, 524, 365);
crop('about', 68, 542, 397, 274);
crop('coaching', 31, 914, 228, 140);
crop('seminars', 277, 914, 228, 140);
crop('programs', 524, 914, 227, 140);
crop('retreats', 769, 914, 227, 140);
console.log('7 assets extracted.');
