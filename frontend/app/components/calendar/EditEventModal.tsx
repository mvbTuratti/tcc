import React from 'react';
import { Modal, Form, DatePicker, TimePicker, Select, Input, Checkbox } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { Classroom } from '../../services/eventService';

const { Option } = Select;

interface EditEventModalProps {
  visible:    boolean;
  form:       FormInstance;
  onCancel:   () => void;
  onFinish:   (values: any) => void;
  classrooms: Classroom[];
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  visible, form, onCancel, onFinish, classrooms
}) => {
  const handleOk = () => {
    form.validateFields().then(onFinish);
  };

  return (
    <Modal
      title="Editar Evento"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Salvar"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="date" label="Data" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="startTime" label="Hora de Início" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="endTime" label="Hora de Término" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
          <Select placeholder="Selecione o tipo">
            <Option value="success">Success</Option>
            <Option value="warning">Warning</Option>
            <Option value="error">Error</Option>
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Descrição" rules={[{ required: true }]}>
          <Input placeholder="Descrição do evento" />
        </Form.Item>

        <Form.Item name="url" label="URL" rules={[{ required: true }]}>
          <Input placeholder="https://meet.google.com/xyz-abc-def" />
        </Form.Item>

        <Form.Item name="classroom_id" label="Sala de Aula">
          <Select placeholder="Selecione a sala (opcional)" allowClear>
            {classrooms.map(c => (
              <Option key={c.id} value={c.id}>{c.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="recurrenceEnabled" valuePropName="checked">
          <Checkbox>Evento Recorrente</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditEventModal;