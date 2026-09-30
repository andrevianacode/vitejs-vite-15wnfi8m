import fs from 'node:fs';
import crypto from 'node:crypto';

// Temporary authenticated transfer endpoint for the isolated Atelier deployment.
// The source contains only a verifier of a random, one-hour transfer key.
// No class password, lesson, or GitHub token is stored in this repository.
const KEY_HASH = 'd10f6173df8939c283d9b917086cf8a33092f1b78b3ff425580efdcfb12724b5';
const EXPIRES = 1790801598706;
const EXPECTED_HASH = '5bd56c9e997c50c4ffabe6f33162fc07e8cfe6086684c047fb81563ae97aad2e';
const EXPECTED_BYTES = 3206995;
const FILE = '/tmp/atelier-4faaff06235f580e842d1104.zip';
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  if (Date.now() > EXPIRES) {
    try { fs.unlinkSync(FILE); } catch {}
    res.statusCode = 410;
    return res.end('Expired');
  }
  const key = String(req.headers.authorization || '').replace(/^Bearer /, '');
  if (key.length !== 64 || hash(key) !== KEY_HASH) {
    res.statusCode = 401;
    return res.end('Unauthorized');
  }
  try {
    if (req.method === 'POST') {
      let body;
      if (Buffer.isBuffer(req.body)) body = req.body;
      else {
        const chunks = []; let size = 0;
        for await (const chunk of req) {
          const b = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          size += b.length;
          if (size > EXPECTED_BYTES) { res.statusCode = 413; return res.end('Too large'); }
          chunks.push(b);
        }
        body = Buffer.concat(chunks);
      }
      if (body.length !== EXPECTED_BYTES || hash(body) !== EXPECTED_HASH) {
        res.statusCode = 400; return res.end('Invalid package');
      }
      fs.writeFileSync(FILE, body, {mode: 0o600});
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ok: true, bytes: body.length, sha256: EXPECTED_HASH}));
    }
    if (req.method === 'GET' || req.method === 'HEAD') {
      if (!fs.existsSync(FILE)) { res.statusCode = 404; return res.end('Not staged on this instance'); }
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Length', EXPECTED_BYTES);
      res.setHeader('Content-Disposition', 'attachment; filename="atelier-source.zip"');
      res.setHeader('X-Atelier-SHA256', EXPECTED_HASH);
      return res.end(req.method === 'HEAD' ? undefined : fs.readFileSync(FILE));
    }
    if (req.method === 'DELETE') {
      try { fs.unlinkSync(FILE); } catch {}
      res.statusCode = 204; return res.end();
    }
    res.statusCode = 405; res.setHeader('Allow', 'POST, GET, HEAD, DELETE'); return res.end();
  } catch {
    res.statusCode = 500;
    return res.end('Transfer unavailable');
  }
}
