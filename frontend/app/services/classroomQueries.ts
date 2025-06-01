// src/services/classroomQueries.ts
import { useQuery } from '@tanstack/react-query';

async function fetchClassrooms(endpoint: string) {
  const response = await fetch(`${endpoint}`, {
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
    staleTime: 5 * 60 * 1000, // evita refetch por 5 minutos
  });
}

export function useEnrolledClassrooms() {
  return useQuery({
    queryKey: ['enrolledClassrooms'],
    queryFn: () => fetchClassrooms('/api/v1/classroom/enrolled'),
    staleTime: 5 * 60 * 1000, // evita refetch por 5 minutos
  });
}