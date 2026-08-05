import type { RegisterType, SignInType } from '@/types/zod';

export async function login({ username, password }: SignInType) {
  const url = 'https://blog-api-65st.onrender.com/api/auth/login';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error(`Error occurred! Status code: ${res.status}`);
  }

  return res.json();
}

export async function register({ username, password, email }: RegisterType) {
  const url = 'https://blog-api-65st.onrender.com/api/auth/register';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, email }),
  });

  if (!res.ok) {
    throw new Error(`Error occurred! Status code: ${res.status}`);
  }

  return res.json();
}
