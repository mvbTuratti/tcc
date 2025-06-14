// src/services/eventQueries.ts
import { useQuery } from '@tanstack/react-query';
import { getEvents } from './eventService';
import type { APIEvent } from './eventService';

export function useEvents() {
  return useQuery<APIEvent[]>({
    queryKey: ['events'],
    queryFn: getEvents,
  });
  
}
