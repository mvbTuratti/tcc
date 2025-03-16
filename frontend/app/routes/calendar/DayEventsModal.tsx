import React from 'react';
import { Modal, Button, List } from 'antd';
import type { Dayjs } from 'dayjs';

interface EventItem {
  type: string;
  content: string;
  startTime: string;
  endTime: string;
  classroom?: string;
}

interface DayEventsModalProps {
  visible: boolean;
  events: EventItem[];
  selectedDate: Dayjs | null;
  onClose: () => void;
  onEditEvent: (item: EventItem, index: number, dateKey: string) => void;
}

const DayEventsModal: React.FC<DayEventsModalProps> = ({
  visible,
  events,
  selectedDate,
  onClose,
  onEditEvent,
}) => {
  const dateKey = selectedDate ? selectedDate.format('YYYY-MM-DD') : '';

  return (
    <Modal
      title="Eventos do dia"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Fechar
        </Button>,
      ]}
    >
      {events.length > 0 ? (
        <List
          dataSource={events}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => onEditEvent(item, index, dateKey)}>
                  Editar
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`${item.startTime} - ${item.endTime}`}
                description={
                  <>
                    <span>
                      {item.content} ({item.type})
                    </span>
                    {item.classroom && <span> | {item.classroom}</span>}
                  </>
                }
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
