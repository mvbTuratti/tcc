import React, { useState } from 'react';
import { Calendar, Button } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import AddEventModal from './AddEventModal';
import DayEventsModal from './DayEventsModal';

const CalendarMain: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDayModalVisible, setIsDayModalVisible] = useState(false);
  const [mode, setMode] = useState<'month' | 'year'>('month');

  const onPanelChange: CalendarProps<Dayjs>['onPanelChange'] = (_, newMode) => {
    setMode(newMode);
  };

  const onSelectDate: CalendarProps<Dayjs>['onSelect'] = (date) => {
    if (mode !== 'month') return; // Só abre o modal se estiver na visualização de dias

    if (!selectedDate || !date.isSame(selectedDate, 'day')) {
      setSelectedDate(date);
      setIsDayModalVisible(true);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem', margin: 0 }}>Calendário</h5>
          <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
            Adicionar Evento
          </Button>
        </div>

        <Calendar onPanelChange={onPanelChange} onSelect={onSelectDate} />
      </div>

      <AddEventModal visible={isAddModalVisible} onClose={() => setIsAddModalVisible(false)} />
      <DayEventsModal visible={isDayModalVisible} date={selectedDate} onClose={() => setIsDayModalVisible(false)} />
    </div>
  );
};

export default CalendarMain;
