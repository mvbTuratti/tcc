import React from 'react';
import { Modal, Form, DatePicker, TimePicker, Select, Input, Button } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { Dayjs } from 'dayjs';

const { Option } = Select;

interface EditEventModalProps {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  onFinish: (values: any) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  visible,
  form,
  onCancel,
  onFinish,
}) => {
  const handleOk = () => {
    form.validateFields().then((values) => {
      onFinish(values);
    });
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
        <Form.Item
          name="date"
          label="Data"
          rules={[{ required: true, message: 'Selecione a data do evento!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="Hora de Início"
          rules={[{ required: true, message: 'Selecione a hora de início!' }]}
        >
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="endTime"
          label="Hora de Término"
          rules={[{ required: true, message: 'Selecione a hora de término!' }]}
        >
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="type"
          label="Tipo"
          rules={[{ required: true, message: 'Selecione o tipo de evento!' }]}
        >
          <Select placeholder="Selecione o tipo de evento">
            <Option value="success">Success</Option>
            <Option value="warning">Warning</Option>
            <Option value="error">Error</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="content"
          label="Conteúdo"
          rules={[{ required: true, message: 'Digite o conteúdo do evento!' }]}
        >
          <Input placeholder="Descrição do evento" />
        </Form.Item>
        <Form.Item name="classroom" label="Sala de Aula">
          <Select placeholder="Selecione a sala (opcional)" allowClear>
            <Option value="sala de aula 1">sala de aula 1</Option>
            <Option value="sala de aula 2">sala de aula 2</Option>
            <Option value="sala de aula 3">sala de aula 3</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditEventModal;