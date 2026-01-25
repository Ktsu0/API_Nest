const PROXY_URL = 'http://localhost:5000';

async function testLogin() {
  const email = 'teste1@gmail.com';
  const password = 'gabi10';

  console.log('--- Testing Login for Admin ---');
  try {
    const loginRes = await fetch(`${PROXY_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    console.log(`Login Status: ${loginRes.status}`);
    const loginText = await loginRes.text();
    console.log('Login Body:', loginText);

    const setCookie = loginRes.headers.get('set-cookie');
    console.log('Login Set-Cookie:', setCookie);
  } catch (e) {
    console.error('Login failed:', e.message);
  }
}

testLogin();
