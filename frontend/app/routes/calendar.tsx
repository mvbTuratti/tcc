// src/routes/calendar.tsx
import React, { useState, useEffect } from 'react'
import { Badge, Calendar, Button, message, Modal, Form } from 'antd'
import type { BadgeProps, CalendarProps } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

import AddEventModal from '../components/calendar/AddEventModal'
import DayEventsModal from '../components/calendar/DayEventsModal'
import EditEventModal from '../components/calendar/EditEventModal'

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getTeacherClassrooms,
  type APIEvent,
  type Classroom,
} from '../services/eventService'

/** Tipo interno que espelha APIEvent.attributes + nome da sala */
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
  event_type: BadgeProps['status']
  classroom_id: string
  classroom?: string
}

/** Expande cada evento recorrente em instâncias individuais */
function expandRecurring(apiEvents: APIEvent[]): APIEvent[] {
  const out: APIEvent[] = []

  apiEvents.forEach(evt => {
    const a = evt.attributes
    if (!a.is_recurring) {
      out.push(evt)
      return
    }

    const start = dayjs(a.event_date)
    const end   = dayjs((a as any).recurrence_ends_at)
    const type  = (a as any).recurrence_type as 'weekly'|'monthly'
    const days  = (a as any).recurrence_days_of_week as string[] || []
    const weeks = (a as any).recurrence_weeks_of_month as number[] || []

    // Semanal
    if (type === 'weekly') {
      let cur = start.clone().startOf('day')
      while (cur.isBefore(end, 'day') || cur.isSame(end, 'day')) {
        if (days.includes(cur.format('dddd').toLowerCase())) {
          out.push({
            ...evt,
            attributes: { ...a, event_date: cur.toISOString() }
          })
        }
        cur = cur.add(1, 'day')
      }
    }

    // Mensal
    if (type === 'monthly') {
      let monthCursor = start.clone().startOf('month')
      while (monthCursor.isBefore(end, 'month') || monthCursor.isSame(end, 'month')) {
        weeks.forEach(weekNum => {
          days.forEach(dayOfWeek => {
            let d = monthCursor.clone().startOf('month')
            let count = 0
            while (d.month() === monthCursor.month()) {
              if (d.format('dddd').toLowerCase() === dayOfWeek) {
                count++
                if (count === weekNum) {
                  if (
                    (d.isAfter(start, 'day') || d.isSame(start, 'day')) &&
                    (d.isBefore(end, 'day')   || d.isSame(end, 'day'))
                  ) {
                    out.push({
                      ...evt,
                      attributes: { ...a, event_date: d.toISOString() }
                    })
                  }
                  break
                }
              }
              d = d.add(1, 'day')
            }
          })
        })
        monthCursor = monthCursor.add(1, 'month')
      }
    }
  })

  return out
}

/** Agrupa a lista (já expandida) por data-chave “YYYY-MM-DD” */
function groupByDate(
  apiEvents: APIEvent[],
  rooms: Classroom[]
): Record<string, CalendarEvent[]> {
  const expanded = expandRecurring(apiEvents)
  const map: Record<string, CalendarEvent[]> = {}

  expanded.forEach(evt => {
    const a = evt.attributes
    const key = a.event_date.slice(0, 10)
    const item: CalendarEvent = {
      id: evt.id,
      event_date: a.event_date,
      start_time: a.start_time,
      end_time: a.end_time,
      url: a.url,
      description: a.description,
      is_recurring: a.is_recurring,
      recurrence_type: (a as any).recurrence_type,
      recurrence_days_of_week: (a as any).recurrence_days_of_week,
      recurrence_weeks_of_month: (a as any).recurrence_weeks_of_month,
      recurrence_ends_at: (a as any).recurrence_ends_at,
      event_type: a.event_type as BadgeProps['status'],
      classroom_id: a.classroom_id!,
      classroom: rooms.find(r => r.id === a.classroom_id)?.name
    }
    if (!map[key]) map[key] = []
    map[key].push(item)
  })

  // ordena por horário
  Object.values(map).forEach(arr =>
    arr.sort((x, y) =>
      dayjs(x.start_time, 'HH:mm:ss').diff(dayjs(y.start_time, 'HH:mm:ss'))
    )
  )

  return map
}

const CalendarPage: React.FC = () => {
  const [events, setEvents]         = useState<Record<string, CalendarEvent[]>>({})
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [mode, setMode]             = useState<'month'|'year'>('month')

  const [isAddVisible, setAddVisible]   = useState(false)
  const [isDayVisible, setDayVisible]   = useState(false)
  const [isEditVisible, setEditVisible] = useState(false)

  const [selectedDate, setSelectedDate] = useState<Dayjs|null>(null)
  const [editingEvent, setEditingEvent] = useState<{
    id: string
    originalDate: string
    data: CalendarEvent
  }|null>(null)

  const [formAdd]  = Form.useForm()
  const [formEdit] = Form.useForm()

  // carrega e agrupa
  useEffect(() => {
    Promise.all([ getEvents(), getTeacherClassrooms() ])
      .then(([evts, rooms]) => {
        setClassrooms(rooms)
        setEvents(groupByDate(evts, rooms))
      })
      .catch(() => message.error('Falha ao carregar eventos'))
  }, [])

  // lista de um dia
  const getListData = (date: Dayjs): CalendarEvent[] =>
    events[date.format('YYYY-MM-DD')] || []

  // renderiza célula do calendário
  const dateCellRender: CalendarProps<Dayjs>['dateCellRender'] = date => (
    <ul className="events">
      {getListData(date).map(evt => (
        <li key={evt.id}>
          <Badge
            status={evt.event_type}
            text={`${evt.start_time}–${evt.end_time} | ${evt.description}`}
          />
        </li>
      ))}
    </ul>
  )

  const onPanelChange: CalendarProps<Dayjs>['onPanelChange'] = (_, newMode) => {
    setMode(newMode)
  }
  const onSelectDate: CalendarProps<Dayjs>['onSelect'] = date => {
    if (mode === 'month') {
      setSelectedDate(date)
      setDayVisible(true)
    }
  }

  const handleAddFinish = async (vals:any)=>{
    const attrs:any = {
      event_date:       vals.date.toISOString(),
      start_time:       vals.startTime.format('HH:mm:ss'),
      end_time:         vals.endTime.format('HH:mm:ss'),
      url:              vals.url,
      description:      vals.description,
      is_recurring:     vals.recurrenceEnabled,
      event_type:       vals.type,
      classroom_id:     vals.classroom_id,
    }
    if(vals.recurrenceEnabled){
      attrs.recurrence_type = vals.recurrenceType
      attrs.recurrence_days_of_week = vals.recurrenceDaysOfWeek
      attrs.recurrence_ends_at = vals.recurrenceEndsAt.format('YYYY-MM-DD')
      if(vals.recurrenceType==='monthly'){
        attrs.recurrence_weeks_of_month = vals.recurrenceWeeksOfMonth
      }
    }
    try{
      await createEvent({data:{type:'event',attributes:attrs}})
      const updated = await getEvents()
      setEvents(groupByDate(updated,classrooms))
      setAddVisible(false)
      formAdd.resetFields()
      message.success('Evento criado')
    }catch{
      message.error('Erro ao criar evento')
    }
  }

  const openEditModal = (evt:CalendarEvent)=>{
    setEditingEvent({id:evt.id,originalDate:evt.event_date,data:evt})
    formEdit.setFieldsValue({
      date: dayjs(evt.event_date),
      startTime: dayjs(evt.start_time,'HH:mm:ss'),
      endTime: dayjs(evt.end_time,'HH:mm:ss'),
      url: evt.url,
      description: evt.description,
      type: evt.event_type,
      classroom_id: evt.classroom_id,
      recurrenceEnabled: evt.is_recurring,
      recurrenceType: evt.recurrence_type,
      recurrenceDaysOfWeek: evt.recurrence_days_of_week,
      recurrenceWeeksOfMonth: evt.recurrence_weeks_of_month,
      recurrenceEndsAt: evt.recurrence_ends_at ? dayjs(evt.recurrence_ends_at) : undefined
    })
    setEditVisible(true)
  }

const handleEditFinish = async (values: any) => {
  if (!editingEvent) return;

  const rawDate = values.date;
  let isoDate: string;
  if (rawDate && typeof rawDate.toDate === 'function') {
    isoDate = rawDate.toDate().toISOString();
  } else {
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) {
      message.error('Data inválida. Selecione uma data válida.');
      return;
    }
    isoDate = d.toISOString();
  }

  const isRec = !!values.recurrenceEnabled;

  const attrs: Record<string, any> = {
    event_date:   isoDate,
    start_time:   values.startTime.format('HH:mm:ss'),
    end_time:     values.endTime.format('HH:mm:ss'),
    url:          String(values.url),
    description:  String(values.description),
    is_recurring: isRec,
    event_type:   String(values.type),

    recurrence_type:         isRec ? String(values.recurrenceType) : null,
    recurrence_days_of_week: isRec ? [...values.recurrenceDaysOfWeek] : null,
    recurrence_weeks_of_month:
      isRec && values.recurrenceType === 'monthly'
        ? [...values.recurrenceWeeksOfMonth]
        : null,
    recurrence_ends_at:      isRec
      ? values.recurrenceEndsAt.toDate().toISOString().slice(0,10)
      : null
  };
  

  const payload = {
    data: {
      type: 'event',
      attributes: attrs,
      relationships: {}
    }
  };

  try {
    await updateEvent(editingEvent.id, payload);

  } catch (err: any) {
    console.error('PATCH /event erro:', err.response?.data);
    message.error('Erro ao atualizar evento.');
  }

  const evts = await getEvents();
  setEvents(groupByDate(evts, classrooms));

  formEdit.resetFields();
  setEditVisible(false);
  setEditingEvent(null);

};


  const handleDelete = (id:string)=>{
    Modal.confirm({
      title:'Confirmar exclusão?',
      onOk: async()=>{
        try{
          await deleteEvent(id)
          const updated = await getEvents()
          setEvents(groupByDate(updated,classrooms))
          message.success('Evento excluído')
        }catch{
          message.error('Erro ao excluir evento')
        }
      }
    })
  }

  return (
    <div style={{margin:20}}>
      <div style={{background:'#F9FAFB',padding:20,borderRadius:8,boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h5 style={{fontWeight:'bold',fontSize:'1.25rem',margin:0}}>Calendário</h5>
          <Button type="primary" onClick={()=>{
            formAdd.resetFields()
            setAddVisible(true)
          }}>Adicionar Evento</Button>
        </div>
        <Calendar cellRender={dateCellRender} onPanelChange={onPanelChange} onSelect={onSelectDate}/>
      </div>

      <AddEventModal
        visible={isAddVisible}
        destroyOnClose
        form={formAdd}
        classrooms={classrooms}
        onCancel={()=>{
          formAdd.resetFields()
          setAddVisible(false)
        }}
        onFinish={handleAddFinish}
      />

      <DayEventsModal
        visible={isDayVisible}
        events={selectedDate?getListData(selectedDate):[]}
        selectedDate={selectedDate}
        onClose={()=>setDayVisible(false)}
        onEditEvent={openEditModal}
        onDeleteEvent={handleDelete}
      />

      <EditEventModal
        visible={isEditVisible}
        destroyOnClose
        form={formEdit}
        classrooms={classrooms}
        onCancel={()=>{
          formEdit.resetFields()
          setEditVisible(false)
        }}
        onFinish={handleEditFinish}
      />
    </div>
  )
}

export default CalendarPage
