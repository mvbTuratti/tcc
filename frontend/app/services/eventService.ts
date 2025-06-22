// src/services/eventService.ts

import axios from 'axios';

const API_BASE = '/api/v1';

const JSONAPI_HEADERS = {
  'Content-Type': 'application/vnd.api+json',
  'Accept':       'application/vnd.api+json',
};

// instância Axios com baseURL e headers JSON:API
const api = axios.create({
  baseURL: API_BASE,
  headers:  JSONAPI_HEADERS,
});

// o formato da resposta segue JSON:API
export interface APIEvent {
  id: string;
  attributes: {
    event_date:   string;
    start_time:   string;
    end_time:     string;
    url:          string;
    description:  string;
    is_recurring: boolean;
    // campos de recorrência (podem ser null)
    recurrence_type?:           string | null;
    recurrence_days_of_week?:   string[] | null;
    recurrence_weeks_of_month?: number[] | null;
    recurrence_ends_at?:        string | null;
    event_type:   string;
    classroom_id: string | null;
  };
}

export interface Classroom {
  id:   string;
  name: string;
}

const extractData = (res: any) => res.data.data;

// GET /api/v1/event
export const getEvents = async (): Promise<APIEvent[]> => {
  const res = await api.get('/event');
  return extractData(res);
};

// POST /api/v1/event
export const createEvent = async (payload: any): Promise<APIEvent> => {
  // payload já deve ser { data: { type:'event', attributes: { …tudo primitivo… } } }
  console.log(payload)
  const res = await api.post('/event', payload);
  return extractData(res);
};

// PATCH /api/v1/event/:id
export const updateEvent = async (id: string, payload: any): Promise<APIEvent> => {
  console.log(payload)
  const res = await api.patch(`/event/${id}`, payload);
  return extractData(res);
};

// DELETE /api/v1/event/:id
export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/event/${id}`);
};

// GET /api/v1/classroom/owned
export const getTeacherClassrooms = async (): Promise<Classroom[]> => {
  const res = await api.get('/classroom/owned');
  return extractData(res).map((c: any) => ({
    id:   c.id,
    name: c.attributes.name,
  }));
};
