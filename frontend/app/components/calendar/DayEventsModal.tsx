import React from 'react';
import { Modal, Button, List } from 'antd';
import type { Dayjs } from 'dayjs';

interface EventItem {
  id:           string;
  type:         string;
  content:      string;
  startTime:    string;
  endTime:      string;
  classroom?:   string;
}

interface DayEventsModalProps {
  visible:      boolean;
  events:       EventItem[];
  selectedDate: Dayjs | null;
  onClose:      () => void;
  onEditEvent:  (item: EventItem) => void;
  onDeleteEvent: (id: string) => void;
}

const DayEventsModal: React.FC<DayEventsModalProps> = ({
  visible, events, selectedDate, onClose, onEditEvent, onDeleteEvent
}) => {
  const dateKey = selectedDate?.format('YYYY-MM-DD') || '';

  return (
    <Modal
      title={`Eventos de ${selectedDate?.format('DD/MM/YYYY')}`}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>Fechar</Button>,
      ]}
    >
      {events.length > 0 ? (
        <List
          dataSource={events}
          renderItem={item => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => onEditEvent(item)}>Editar</Button>,
                <Button type="link" danger onClick={() => onDeleteEvent(item.id)}>Deletar</Button>
              ]}
            >
              <List.Item.Meta
                title={`${item.startTime}–${item.endTime}`}
                description={`${item.content} (${item.type})${item.classroom ? ` | ${item.classroom}` : ''}`}
              />
            </List.Item>
          )}
        />
      ) : (
        <p>Nenhum evento para este dia.</p>
      )}
    </Modal>
  );
};

export default DayEventsModal;
