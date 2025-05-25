import React, { useState } from 'react';
import {
  Badge,
  Calendar,
  Button,
  List,
  Form,
} from 'antd';
import type { BadgeProps, CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import AddEventModal from './calendar/AddEventModal';
import DayEventsModal from './calendar/DayEventsModal';
import EditEventModal from './calendar/EditEventModal';

const { useForm } = Form;

// Tipos de dados
interface EventItem {
  type: string;
  content: string;
  startTime: string;  // Formato "HH:mm"
  endTime: string;    // Formato "HH:mm"
  classroom?: string; // Campo opcional para sala de aula
}

interface EditingEventData {
  originalDate: string;
  index: number;
  data: EventItem;
}

// Componente principal
const CalendarPage: React.FC = () => {
  // --------------------- ESTADOS ---------------------
  // Armazena todos os eventos, indexados por data (chave: "YYYY-MM-DD")
  const [events, setEvents] = useState<Record<string, EventItem[]>>({});

  // Controle dos modais
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDayModalVisible, setIsDayModalVisible] = useState(false);

  // Data selecionada para mostrar/editar eventos do dia
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // Dados do evento que está sendo editado (se houver)
  const [editingEvent, setEditingEvent] = useState<EditingEventData | null>(null);

  // Formulários do antd para adicionar e editar eventos
  const [formAdd] = useForm(); 
  const [formEdit] = useForm();

  // Controle do modo do calendário (mês/ano) para evitar bug do dropdown
  const [mode, setMode] = useState<'month' | 'year'>('month');

  // --------------------- FUNÇÕES DE AJUDA ---------------------
  // Retorna os eventos de uma data específica, ordenados pelo horário de início
  const getListData = (value: Dayjs): EventItem[] => {
    const dateKey = value.format('YYYY-MM-DD');
    const dayEvents = events[dateKey] || [];
    return dayEvents.sort((a, b) =>
      dayjs(a.startTime, 'HH:mm').diff(dayjs(b.startTime, 'HH:mm'))
    );
  };

  // Renderização dos eventos dentro de cada célula do calendário
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge
              status={item.type as BadgeProps['status']}
              text={`${item.startTime} - ${item.endTime} | ${item.content}${
                item.classroom ? ` | ${item.classroom}` : ''
              }`}
            />
          </li>
        ))}
      </ul>
    );
  };

  // --------------------- EVENTOS DO CALENDÁRIO ---------------------
  // Atualiza o modo quando o painel do calendário muda
  const onPanelChange: CalendarProps<Dayjs>['onPanelChange'] = (_, newMode) => {
    setMode(newMode);
  };

  // Ao selecionar uma data, abre o modal de "Eventos do dia" (se estivermos no modo "month")
  const onSelectDate: CalendarProps<Dayjs>['onSelect'] = (date) => {
    if (mode === 'month') {
      setSelectedDate(date);
      setIsDayModalVisible(true);
    }
  };

  // --------------------- MODAL "EVENTOS DO DIA" ---------------------
  const handleDayModalCancel = () => {
    setIsDayModalVisible(false);
    setSelectedDate(null);
  };

  // Filtra os eventos do dia selecionado
  const eventsForSelectedDay = selectedDate ? getListData(selectedDate) : [];

  // --------------------- MODAL "ADICIONAR EVENTO" ---------------------
  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    formAdd.resetFields();
  };

  // Lógica de adicionar evento (simples ou recorrente)
  const handleAddFinish = (values: any) => {
    const date: Dayjs = values.date;
    const startTime: Dayjs = values.startTime;
    const endTime: Dayjs = values.endTime;

    const newEvent: EventItem = {
      type: values.type,
      content: values.content,
      startTime: startTime.format('HH:mm'),
      endTime: endTime.format('HH:mm'),
      classroom: values.classroom,
    };

    const recurrenceEnabled = values.recurrenceEnabled;

    if (recurrenceEnabled) {
      const frequency = values.frequency; // "semanal", "quinzenal" ou "mensal"
      const recurrenceEndDate: Dayjs = values.recurrenceEndDate;

      // Percorre as datas de acordo com a frequência até a data final
      setEvents((prev) => {
        const updatedEvents = { ...prev };
        let current = date.clone();

        while (
          current.isBefore(recurrenceEndDate) ||
          current.isSame(recurrenceEndDate, 'day')
        ) {
          const dateKey = current.format('YYYY-MM-DD');
          const prevEventsForDate = updatedEvents[dateKey] || [];

          updatedEvents[dateKey] = [...prevEventsForDate, newEvent].sort(
            (a, b) =>
              dayjs(a.startTime, 'HH:mm').diff(dayjs(b.startTime, 'HH:mm'))
          );

          if (frequency === 'semanal') {
            current = current.add(7, 'day');
          } else if (frequency === 'quinzenal') {
            current = current.add(15, 'day');
          } else if (frequency === 'mensal') {
            current = current.add(1, 'month');
          } else {
            break;
          }
        }
        return updatedEvents;
      });
    } else {
      // Sem recorrência: adiciona o evento apenas na data escolhida
      setEvents((prev) => {
        const dateKey = date.format('YYYY-MM-DD');
        const prevEventsForDate = prev[dateKey] || [];
        const newEvents = [...prevEventsForDate, newEvent].sort((a, b) =>
          dayjs(a.startTime, 'HH:mm').diff(dayjs(b.startTime, 'HH:mm'))
        );
        return { ...prev, [dateKey]: newEvents };
      });
    }

    setIsAddModalVisible(false);
    formAdd.resetFields();
  };

  // --------------------- MODAL "EDITAR EVENTO" ---------------------
  const openEditModal = (eventData: EventItem, index: number, dateKey: string) => {
    setEditingEvent({ originalDate: dateKey, index, data: eventData });
    formEdit.setFieldsValue({
      date: dayjs(dateKey, 'YYYY-MM-DD'),
      startTime: dayjs(eventData.startTime, 'HH:mm'),
      endTime: dayjs(eventData.endTime, 'HH:mm'),
      type: eventData.type,
      content: eventData.content,
      classroom: eventData.classroom,
    });
  };

  const handleEditCancel = () => {
    setEditingEvent(null);
    formEdit.resetFields();
  };

  const handleEditFinish = (values: any) => {
    if (!editingEvent) return;

    const newDate: Dayjs = values.date;
    const newDateKey = newDate.format('YYYY-MM-DD');

    const updatedEvent: EventItem = {
      type: values.type,
      content: values.content,
      startTime: values.startTime.format('HH:mm'),
      endTime: values.endTime.format('HH:mm'),
      classroom: values.classroom,
    };

    setEvents((prev) => {
      const updatedEvents = { ...prev };

      // Remove o evento da data original
      const originalEvents = updatedEvents[editingEvent.originalDate] || [];
      originalEvents.splice(editingEvent.index, 1);
      updatedEvents[editingEvent.originalDate] = originalEvents;

      // Adiciona o evento atualizado na nova data
      const targetEvents = updatedEvents[newDateKey] || [];
      const newEventList = [...targetEvents, updatedEvent].sort((a, b) =>
        dayjs(a.startTime, 'HH:mm').diff(dayjs(b.startTime, 'HH:mm'))
      );
      updatedEvents[newDateKey] = newEventList;

      return updatedEvents;
    });

    setEditingEvent(null);
    formEdit.resetFields();
  };

  // --------------------- RENDERIZAÇÃO ---------------------
  return (
    <div style={{ margin: '20px' }}>
      <div
        style={{
          background: '#F9FAFB',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {/* Cabeçalho com título e botão "Adicionar Evento" */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem', margin: 0 }}>
            Calendário
          </h5>
          <Button type="primary" onClick={showAddModal}>
            Adicionar Evento
          </Button>
        </div>

        {/* Calendar com controle de modo e de seleção de data */}
        <Calendar
          cellRender={dateCellRender}
          onPanelChange={onPanelChange}
          onSelect={onSelectDate}
        />
      </div>

      {/* Modal "Adicionar Evento" */}
      <AddEventModal
        visible={isAddModalVisible}
        form={formAdd}
        onCancel={handleAddCancel}
        onFinish={handleAddFinish}
      />

      {/* Modal "Eventos do dia" */}
      <DayEventsModal
        visible={isDayModalVisible}
        events={eventsForSelectedDay}
        selectedDate={selectedDate}
        onClose={handleDayModalCancel}
        onEditEvent={openEditModal}
      />

      {/* Modal "Editar Evento" */}
      <EditEventModal
        visible={!!editingEvent}
        form={formEdit}
        onCancel={handleEditCancel}
        onFinish={handleEditFinish}
      />
    </div>
  );
};

export default CalendarPage;