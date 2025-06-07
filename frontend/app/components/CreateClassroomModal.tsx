// src/components/CreateClassroomModal.tsx
import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate?: (data: { name: string; description?: string }) => void;
}

const { TextArea } = Input;

const CreateClassroomModal: React.FC<Props> = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();

  const handleFinish = async () => {
    const values = await form.validateFields();
    onCreate?.({ name: values.name, description: values.description });
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Nova Sala de Aula"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={[
        <Button key="cancel" onClick={() => {
          form.resetFields();
          onClose();
        }}>
          Cancelar
        </Button>,
        <Button key="create" type="primary" onClick={handleFinish}>
          Criar Sala
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Nome da Sala"
          rules={[
            { required: true, message: 'Informe um nome' },
            { max: 250, message: 'Máximo de 250 caracteres' },
          ]}
        >
          <Input placeholder="Ex: Aula de espanhol" maxLength={250} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição"
          rules={[{ max: 1000, message: 'Máximo de 1000 caracteres' }]}
        >
          <TextArea rows={4} maxLength={1000} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateClassroomModal;