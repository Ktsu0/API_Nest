const PROXY_URL = 'http://localhost:5000';

async function testFlow() {
  const email = 'teste1@gmail.com';
  const password = 'password123';

  console.log('--- 1. Registering Admin User ---');
  try {
    const regRes = await fetch(`${PROXY_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName: 'Test',
        lastName: 'Admin',
        Cpf: '12345678900',
        telefone: '11999999999',
        cep: '12345-678',
        genero: 'Other',
        nascimento: '2000-01-01',
      }),
    });
    const regText = await regRes.text();
    console.log(`Register Status: ${regRes.status}`);
    console.log('Register Body:', regText);

    // Check if cookie sent (unlikely for register alone usually, but controller sends it)
    const regCookies = regRes.headers.get('set-cookie');
    console.log('Register Set-Cookie:', regCookies);
  } catch (e) {
    console.error('Register failed:', e.message);
  }

  console.log('\n--- 2. Logging In ---');
  let cookie = '';
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

    if (setCookie) {
      // Extract the access_token part
      cookie = setCookie.split(';')[0];
    }
  } catch (e) {
    console.error('Login failed:', e.message);
    return;
  }

  if (!cookie) {
    console.error('No cookie received. Cannot proceed.');
    // Proceed anyway if register sent it?
    return;
  }

  console.log('\n--- 3. Adding Card (Series) ---');
  try {
    const cardData = {
      titulo: 'Test Series via Script',
      detalhes: 'Testing integration',
      imagem: 'https://via.placeholder.com/150',
      estoque: 10,
      valorUnitario: 50.5,
      tipo: 'serie', // Ignored by backend but sent by front
      meta: {
        temporada: '1',
        tema: 'Test Theme',
      },
    };

    const addRes = await fetch(`${PROXY_URL}/series`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify(cardData),
    });

    console.log(`Add Card Status: ${addRes.status}`);
    const addText = await addRes.text();
    console.log('Add Card Body:', addText);
  } catch (e) {
    console.error('Add Card failed:', e.message);
  }
}

testFlow();
