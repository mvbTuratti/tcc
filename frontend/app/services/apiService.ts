const BASE_URL = 'http://localhost:4000';

async function fetchWithAuth<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar ${endpoint}: ${response.statusText}`);
  }

  return response.json();
}

export const apiService = {
  getEnrolledClassrooms: () => fetchWithAuth<any[]>('/api/v1/classroom/enrolled'),
  getOwnedClassrooms: () => fetchWithAuth<any[]>('/api/v1/classroom/owned'),
};