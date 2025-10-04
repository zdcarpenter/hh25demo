const store = new Map();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function sendCode(phone, product) {
  const code = generateCode();
  const key = `${phone}:${product}`;
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  store.set(key, { code, expiresAt });
  return { code, hint: `(${code.slice(-2)} shown for demo)` };
}

export function verifyCode(phone, product, code) {
  const key = `${phone}:${product}`;
  const entry = store.get(key);
  if (!entry) return { ok: false, error: 'No code sent' };
  if (Date.now() > entry.expiresAt) return { ok: false, error: 'Code expired' };
  if (entry.code !== code) return { ok: false, error: 'Invalid code' };
  store.delete(key);
  return { ok: true };
}
