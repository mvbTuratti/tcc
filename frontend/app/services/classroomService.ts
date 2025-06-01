// src/services/classroomService.ts

const BASE_URL = '/api/v1';

const headers = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json',
};

export async function deleteClassroomById(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/classroom/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.errors?.[0]?.detail || 'Erro ao deletar sala');
  }
}