(async () => {
  try {
    const url = 'http://localhost:9003/api/debug/update-user';
    const body = { id: '8a8c45e0-3a69-4f72-abcd-234567890101', updates: { nombre: 'PruebaDepuracion' } };
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await resp.text();
    console.log('STATUS', resp.status);
    console.log('HEADERS', JSON.stringify(Object.fromEntries(resp.headers.entries())));
    console.log('BODY', text);
  } catch (err) {
    console.error('ERROR CALLING DEBUG UPDATE:', err);
  }
})();
