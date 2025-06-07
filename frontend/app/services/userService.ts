// src/services/userService.ts

const BASE_URL = 'http://localhost:4000';

const headers = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json',
};

export async function fetchCurrentUser() {
  const response = await fetch(`/api/v1/user/me`, {
    method: 'GET',
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar usuário');
  }

  const json = await response.json();
  const user = json.data?.[0];
  return {
    id: user.id,
    name: user.attributes.name,
    picture: user.attributes.picture,
  };
}

export function logout() {
  window.location.href = `/sign-out`;
}