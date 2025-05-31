// src/components/CreateClassroomModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Button,
} from 'antd';

type LinkOption = 'system' | 'manual';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate?: (data: {
    name: string;
    recurrence: string;
    linkOption: LinkOption;
    manualLink?: string;
    extraProfessor?: string;
    description?: string;
  }) => void;
}

const { TextArea } = Input;
const { Option } = Select;

const CreateClassroomModal: React.FC<Props> = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();
  const [linkOption, setLinkOption] = useState<LinkOption>('system');

  const handleFinish = async () => {
    const values = await form.validateFields();
    const payload = {
      name: values.name,
      recurrence: values.recurrence,
      linkOption,
      manualLink: values.manualLink,
      extraProfessor: values.extraProfessor,
      description: values.description,
    };
    onCreate?.(payload);
    form.resetFields();
    setLinkOption('system');
    onClose();
  };

  return (
    <Modal
      title="Nova Sala de Aula"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        setLinkOption('system');
        onClose();
      }}
      footer={[
        <Button key="cancel" onClick={onClose}>
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
          name="recurrence"
          label="Recorrência"
          rules={[{ required: true, message: 'Selecione a recorrência' }]}
        >
          <Select placeholder="Semanal, Quinzenal ou Mensal">
            <Option value="semanal">Semanal</Option>
            <Option value="quinzenal">Quinzenal</Option>
            <Option value="mensal">Mensal</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="linkOption"
          label="Link da Sala de Aula"
          rules={[{ required: true, message: 'Escolha uma opção de link' }]}
        >
          <Radio.Group
            onChange={(e) => setLinkOption(e.target.value)}
            value={linkOption}
          >
            <Radio value="system">Gerado pelo sistema</Radio>
            <Radio value="manual">Adicionar manualmente</Radio>
          </Radio.Group>
        </Form.Item>

        {linkOption === 'manual' && (
          <Form.Item
            name="manualLink"
            label="Link Manual"
            rules={[{ required: true, message: 'Insira o link da sala' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
        )}

        <Form.Item
          name="extraProfessor"
          label="Email de Professor Extra"
          rules={[
            { type: 'email', message: 'Email inválido' },
            { max: 250, message: 'Máximo de 250 caracteres' },
          ]}
        >
          <Input placeholder="email@exemplo.com" maxLength={250} />
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