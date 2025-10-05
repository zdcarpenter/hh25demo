// Minimal client helper to start an MFA session and return a redirect URL
export async function createMfaSession({ amount, successUrl, email = '' }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const body = {
    appId: 'app_jvijdrec',
    amount: Number(Number(amount || 0).toFixed(2)),
    currency: 'USD',
    user: { email },
    successUrl,
    failureUrl: `${origin}/mfa/failure`,
  };

  const res = await fetch('https://open-mfa.vercel.app/api/v1/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-merchant-id': 'mch_2q1pj10y',
      'Authorization': 'mk_test_bSl7UzrGG0HR_IJj-q2GiAmaV3jtIoitt-Fbb5WYTF0',
    },
    body: JSON.stringify(body),
  });

  const raw = await res.text().catch(() => '');
  try {
    const json = JSON.parse(raw || '{}');
    if (json.url || json.redirectUrl || json.mfaUrl) return json.url || json.redirectUrl || json.mfaUrl;
  } catch {}
  if (/^https?:\/\//.test(raw)) return raw; // plain URL
  throw new Error('Failed to create MFA session');
}
