// src/components/calendar/DayEventsModal.tsx
import React from 'react'
import { Modal, Button, List, Badge } from 'antd'
import type { Dayjs } from 'dayjs'

/** Mesma shape de CalendarEvent em calendar.tsx */
interface CalendarEvent {
  id: string
  event_date: string
  start_time: string
  end_time: string
  url: string
  description: string
  is_recurring: boolean
  recurrence_type?: 'weekly' | 'monthly'
  recurrence_days_of_week?: string[]
  recurrence_weeks_of_month?: number[]
  recurrence_ends_at?: string
  event_type: string
  classroom_id: string
  classroom?: string
}

interface DayEventsModalProps {
  visible: boolean
  events: CalendarEvent[]
  selectedDate: Dayjs | null
  onClose: () => void
  onEditEvent: (evt: CalendarEvent) => void
  onDeleteEvent: (id: string) => void
}

const DayEventsModal: React.FC<DayEventsModalProps> = ({
  visible,
  events,
  selectedDate,
  onClose,
  onEditEvent,
  onDeleteEvent
}) => {
  const title = selectedDate
    ? selectedDate.format('DD/MM/YYYY')
    : ''

  return (
    <Modal
      title={`Eventos de ${title}`}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Fechar
        </Button>
      ]}
    >
      {events.length > 0 ? (
        <List
          dataSource={events}
          renderItem={evt => (
            <List.Item
              actions={[
                <Button
                  key="edit"
                  type="link"
                  onClick={() => onEditEvent(evt)}
                >
                  Editar
                </Button>,
                <Button
                  key="delete"
                  type="link"
                  danger
                  onClick={() => onDeleteEvent(evt.id)}
                >
                  Excluir
                </Button>
              ]}
            >
              <List.Item.Meta
                title={`${evt.start_time}–${evt.end_time}`}
                description={
                  <>
                    <span>{evt.description}</span>
                    {' '}
                    <Badge
                      status={evt.event_type as any}
                      text={evt.event_type}
                    />
                    {evt.classroom && <> | {evt.classroom}</>}
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
  )
}

export default DayEventsModal