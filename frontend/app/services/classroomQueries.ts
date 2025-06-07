// src/services/classroomQueries.ts
import { useQuery } from '@tanstack/react-query';

async function fetchClassrooms(endpoint: string) {
  const response = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar ${endpoint}: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data.map((item: any) => ({
    id: item.id,
    name: item.attributes.name,
    instructor: item.attributes.description ?? '(sem descrição)',
  }));
}

export function useOwnedClassrooms() {
  return useQuery({
    queryKey: ['ownedClassrooms'],
    queryFn: () => fetchClassrooms('/api/v1/classroom/owned'),
  });
}

export function useEnrolledClassrooms() {
  return useQuery({
    queryKey: ['enrolledClassrooms'],
    queryFn: () => fetchClassrooms('/api/v1/classroom/enrolled'),
  });
}

export async function createClassroom(name: string, description?: string) {
  const response = await fetch('/api/v1/classroom', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'classroom',
        attributes: {
          name,
          description,
        },
      },
    }),
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.errors?.[0]?.detail || 'Erro ao criar sala');
  }

  const json = await response.json();
  return {
    id: json.data.id,
    name: json.data.attributes.name,
    instructor: json.data.attributes.description ?? '(sem descrição)',
  };
}