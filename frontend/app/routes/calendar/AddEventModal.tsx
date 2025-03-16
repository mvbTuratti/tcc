import React from 'react';
import { Modal, Form, DatePicker, TimePicker, Select, Input, Checkbox } from 'antd';
import type { FormInstance } from 'antd/es/form';

const { Option } = Select;

interface AddEventModalProps {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  onFinish: (values: any) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  visible,
  form,
  onCancel,
  onFinish,
}) => {
  // Quando o usuário clica em "Ok" no modal
  const handleOk = () => {
    form.validateFields().then((values) => {
      onFinish(values);
    });
  };

  return (
    <Modal
      title="Adicionar novo evento"
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

        <Form.Item name="recurrenceEnabled" valuePropName="checked">
          <Checkbox>Habilitar recorrência</Checkbox>
        </Form.Item>

        {/* Campos de recorrência aparecem somente se "recurrenceEnabled" estiver marcado */}
        <Form.Item
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.recurrenceEnabled !== currentValues.recurrenceEnabled
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('recurrenceEnabled') ? (
              <>
                <Form.Item
                  name="frequency"
                  label="Frequência"
                  rules={[{ required: true, message: 'Selecione a frequência!' }]}
                >
                  <Select placeholder="Selecione a frequência">
                    <Option value="semanal">Semanal</Option>
                    <Option value="quinzenal">Quinzenal</Option>
                    <Option value="mensal">Mensal</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="recurrenceEndDate"
                  label="Data de Fim da Recorrência"
                  rules={[{ required: true, message: 'Selecione a data de fim!' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </>
            ) : null
          }
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEventModal;
