import axios from 'axios';

const API_BASE = '/api/v1';

const JSONAPI_HEADERS = {
  'Content-Type': 'application/vnd.api+json',
  'Accept':       'application/vnd.api+json',
};

const api = axios.create({
  baseURL: API_BASE,
  headers:  JSONAPI_HEADERS,
});

export interface Classroom {
  id: string;
  name: string;
}

export interface APIEvent {
  id: string;
  attributes: {
    event_date:   string;
    start_time:   string;
    end_time:     string;
    url:          string;
    description:  string;
    is_recurring: boolean;
    event_type:   string;
    classroom_id: string | null;
  };
}

const extractData = (res: any) => res.data.data;

export const getEvents = async (): Promise<APIEvent[]> => {
  try {
    const res = await api.get('/event');
    return extractData(res);
  } catch (error) {
    console.error('Erro em getEvents:', error);
    throw error;
  }
};

export const createEvent = async (payload: any): Promise<APIEvent> => {
  const res = await api.post('/event', payload);
  return extractData(res);
};

export const updateEvent = async (id: string, payload: any): Promise<APIEvent> => {
  const res = await api.patch(`/event/${id}`, payload);
  return extractData(res);
};

export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/event/${id}`);
};

export const getTeacherClassrooms = async (): Promise<Classroom[]> => {
  const res = await api.get('/classroom/owned');
  return extractData(res).map((c: any) => ({
    id:   c.id,
    name: c.attributes.name,
  }));
};