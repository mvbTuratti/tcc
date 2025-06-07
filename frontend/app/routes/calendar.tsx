import React, { useState, useEffect } from 'react';
import { Badge, Calendar, Button, Form, Modal, message } from 'antd';
import type { BadgeProps, CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import AddEventModal from '../components/calendar/AddEventModal';
import DayEventsModal from '../components/calendar/DayEventsModal';
import EditEventModal from '../components/calendar/EditEventModal';

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getTeacherClassrooms,
  type APIEvent,
  type Classroom,
} from '../services/eventService';

interface EventItem {
  id:           string;
  type:         BadgeProps['status'];
  content:      string;
  startTime:    string;
  endTime:      string;
  url:          string;
  is_recurring: boolean;
  classroom_id: string | null;
  classroom?:   string;
}

interface EditingEventData {
  id:           string;
  originalDate: string;
  data:         EventItem;
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Record<string, EventItem[]>>({});
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [mode, setMode] = useState<'month' | 'year'>('month');

  // modals
  const [isAddVisible, setAddVisible]     = useState(false);
  const [isDayVisible, setDayVisible]     = useState(false);
  const [isEditVisible, setEditVisible]   = useState(false);
  const [selectedDate, setSelectedDate]   = useState<Dayjs | null>(null);
  const [editingEvent, setEditingEvent]   = useState<EditingEventData | null>(null);

  const [formAdd]  = Form.useForm();
  const [formEdit] = Form.useForm();

  // Group API events into a date-keyed map
  const groupByDate = (apiEvents: APIEvent[], rooms: Classroom[]): Record<string, EventItem[]> => {
    const map: Record<string, EventItem[]> = {};
    apiEvents.forEach(evt => {
      const a = evt.attributes;
      const dateKey = a.event_date.slice(0, 10); // "YYYY-MM-DD"
      const item: EventItem = {
        id:           evt.id,
        type:         a.event_type as BadgeProps['status'],
        content:      a.description,
        startTime:    a.start_time,
        endTime:      a.end_time,
        url:          a.url,
        is_recurring: a.is_recurring,
        classroom_id: a.classroom_id,
        classroom:    rooms.find(r => r.id === a.classroom_id)?.name,
      };
      map[dateKey] = (map[dateKey] || []).concat(item)
        .sort((x, y) => dayjs(x.startTime, 'HH:mm:ss').diff(dayjs(y.startTime, 'HH:mm:ss')));
    });
    return map;
  };

  // initial fetch
  useEffect(() => {
    (async () => {
      try {
        const [apiEvents, rooms] = await Promise.all([
          getEvents(),
          getTeacherClassrooms()
        ]);
        setClassrooms(rooms);
        setEvents(groupByDate(apiEvents, rooms));
      } catch (err) {
        message.error('Falha ao carregar eventos.');
        console.error(err);
      }
    })();
  }, []);

  // Helpers
  const getListData = (value: Dayjs): EventItem[] => {
    return events[value.format('YYYY-MM-DD')] || [];
  };

  const dateCellRender: CalendarProps<Dayjs>['dateCellRender'] = (value) => (
    <ul className="events">
      {getListData(value).map((item) => (
        <li key={item.id}>
          <Badge
            status={item.type}
            text={`${item.startTime}–${item.endTime} | ${item.content}${item.classroom ? ` | ${item.classroom}` : ''}`}
          />
        </li>
      ))}
    </ul>
  );

  // Calendar events
  const onPanelChange: CalendarProps<Dayjs>['onPanelChange'] = (_, newMode) => {
    setMode(newMode);
  };
  const onSelectDate: CalendarProps<Dayjs>['onSelect'] = (date) => {
    if (mode !== 'month') return;
    setSelectedDate(date);
    setDayVisible(true);
  };

  // Add
  const handleAddFinish = async (values: any) => {
    const payload = {
      data: {
        type: 'event',
        attributes: {
          event_date:   values.date.toISOString(),
          start_time:   values.startTime.format('HH:mm:ss'),
          end_time:     values.endTime.format('HH:mm:ss'),
          url:          values.url,
          description:  values.description,
          is_recurring: values.recurrenceEnabled || false,
          event_type:   values.type,
          classroom_id: values.classroom_id ?? null,
        },
        relationships: {}
      }
    };
    try {
      await createEvent(payload);
      const updated = await getEvents();
      setEvents(groupByDate(updated, classrooms));
      setAddVisible(false);
      formAdd.resetFields();
      message.success('Evento criado com sucesso.');
    } catch (err) {
      message.error('Falha ao criar evento.');
      console.error(err);
    }
  };

  // Edit
  const openEditModal = (item: EventItem) => {
    setEditingEvent({ id: item.id, originalDate: item.id, data: item });
    formEdit.setFieldsValue({
      date:              dayjs(item.id.slice(0, 10)),
      startTime:         dayjs(item.startTime, 'HH:mm:ss'),
      endTime:           dayjs(item.endTime, 'HH:mm:ss'),
      type:              item.type,
      description:       item.content,
      url:               item.url,
      classroom_id:      item.classroom_id,
      recurrenceEnabled: item.is_recurring,
    });
    setEditVisible(true);
  };

  const handleEditFinish = async (values: any) => {
    if (!editingEvent) return;
    const payload = {
      data: {
        type: 'event',
        attributes: {
          event_date:   values.date.toISOString(),
          start_time:   values.startTime.format('HH:mm:ss'),
          end_time:     values.endTime.format('HH:mm:ss'),
          url:          values.url,
          description:  values.description,
          is_recurring: values.recurrenceEnabled || false,
          event_type:   values.type,
          classroom_id: values.classroom_id ?? null,
        },
        relationships: {}
      }
    };
    try {
      await updateEvent(editingEvent.id, payload);
      const updated = await getEvents();
      setEvents(groupByDate(updated, classrooms));
      setEditVisible(false);
      setEditingEvent(null);
      formEdit.resetFields();
      message.success('Evento atualizado.');
    } catch (err) {
      message.error('Falha ao atualizar evento.');
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Confirmar exclusão?',
      onOk: async () => {
        try {
          await deleteEvent(id);
          const updated = await getEvents();
          setEvents(groupByDate(updated, classrooms));
          message.success('Evento excluído.');
        } catch {
          message.error('Falha ao excluir.');
        }
      }
    });
  };

  return (
    <div style={{ margin: 20 }}>
      <div style={{
        background: '#F9FAFB',
        padding: 20,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem', margin: 0 }}>Calendário</h5>
          <Button type="primary" onClick={() => setAddVisible(true)}>
            Adicionar Evento
          </Button>
        </div>
        <Calendar
          cellRender={dateCellRender}
          onPanelChange={onPanelChange}
          onSelect={onSelectDate}
        />
      </div>

      <AddEventModal
        visible={isAddVisible}
        form={formAdd}
        classrooms={classrooms}
        onCancel={() => setAddVisible(false)}
        onFinish={handleAddFinish}
      />

      <DayEventsModal
        visible={isDayVisible}
        events={selectedDate ? getListData(selectedDate) : []}
        selectedDate={selectedDate}
        onClose={() => setDayVisible(false)}
        onEditEvent={openEditModal}
        onDeleteEvent={handleDelete}
      />

      <EditEventModal
        visible={isEditVisible}
        form={formEdit}
        classrooms={classrooms}
        onCancel={() => setEditVisible(false)}
        onFinish={handleEditFinish}
      />
    </div>
  );
};

export default CalendarPage;
