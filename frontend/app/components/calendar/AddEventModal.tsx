import React from 'react'
import { Modal, Form, DatePicker, TimePicker, Select, Input, Checkbox } from 'antd'
import type { FormInstance } from 'antd/es/form'
import type { Classroom } from '../../services/eventService'

const { Option } = Select
const daysOptions = [
  'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
]
const weeksOptions = [1,2,3,4,5]

interface Props {
  visible: boolean
  destroyOnClose?: boolean
  form: FormInstance
  onCancel: ()=>void
  onFinish:(vals:any)=>void
  classrooms: Classroom[]
}

export default function AddEventModal({
  visible,
  destroyOnClose,
  form,
  onCancel,
  onFinish,
  classrooms
}:Props){
  const ok = ()=>form.validateFields().then(onFinish)
  return (
    <Modal
      title="Adicionar Evento"
      visible={visible}
      destroyOnClose={destroyOnClose}
      onOk={ok}
      onCancel={onCancel}
      okText="Salvar"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="date"           label="Data"               rules={[{required:true,message:'Escolha a data'}]}>
          <DatePicker style={{width:'100%'}}/>
        </Form.Item>
        <Form.Item name="startTime"     label="Hora Início"        rules={[{required:true,message:'Horário obrigatório'}]}>
          <TimePicker format="HH:mm" style={{width:'100%'}}/>
        </Form.Item>
        <Form.Item name="endTime"       label="Hora Fim"           rules={[{required:true,message:'Horário obrigatório'}]}>
          <TimePicker format="HH:mm" style={{width:'100%'}}/>
        </Form.Item>
        <Form.Item name="type"          label="Tipo"               rules={[{required:true,message:'Tipo obrigatório'}]}>
          <Select>
            <Option value="success">Success</Option>
            <Option value="warning">Warning</Option>
            <Option value="error">Error</Option>
          </Select>
        </Form.Item>
        <Form.Item name="description"   label="Descrição"          rules={[{required:true,message:'Descrição obrigatória'}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="url"           label="URL"                rules={[{required:true,message:'URL obrigatória'}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="classroom_id"  label="Sala"               rules={[{required:true,message:'Escolha a sala'}]}>
          <Select allowClear>
            {classrooms.map(c=> <Option key={c.id} value={c.id}>{c.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="recurrenceEnabled" valuePropName="checked">
          <Checkbox>Evento Recorrente</Checkbox>
        </Form.Item>

        <Form.Item shouldUpdate={(p,c)=>p.recurrenceEnabled!==c.recurrenceEnabled}>
          {() => form.getFieldValue('recurrenceEnabled') && (
            <>
              <Form.Item name="recurrenceType" label="Frequência" rules={[{required:true,message:'Escolha a frequência'}]}>
                <Select>
                  <Option value="weekly">Semanal</Option>
                  <Option value="monthly">Mensal</Option>
                </Select>
              </Form.Item>
              <Form.Item name="recurrenceDaysOfWeek" label="Dias da Semana" rules={[{required:true,message:'Escolha ao menos um dia'}]}>
                <Select mode="multiple" options={daysOptions.map(d=>({label:d,value:d}))}/>
              </Form.Item>
              <Form.Item shouldUpdate={(p,c)=>p.recurrenceType!==c.recurrenceType}>
                {() => form.getFieldValue('recurrenceType')==='monthly' && (
                  <Form.Item name="recurrenceWeeksOfMonth" label="Semanas do Mês" rules={[{required:true,message:'Escolha ao menos uma semana'}]}>
                    <Select mode="multiple" options={weeksOptions.map(w=>({label:`${w}ª semana`,value:w}))}/>
                  </Form.Item>
                )}
              </Form.Item>
              <Form.Item name="recurrenceEndsAt" label="Termina em" rules={[{required:true,message:'Data final obrigatória'}]}>
                <DatePicker style={{width:'100%'}}/>
              </Form.Item>
            </>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}
