import React, { useState } from 'react';
import {
  Modal,
  Steps,
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  TimePicker,
  Button,
} from 'antd';
import type { Dayjs } from 'dayjs';

const { Step } = Steps;

export interface ClassroomDate {
  date?: Dayjs;
  start?: Dayjs;
  end?: Dayjs;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate?: (data: {
    name: string;
    recurrence: string;
    linkOption: 'system' | 'manual';
    manualLink?: string;
    extraProfessor?: string;
    dates: ClassroomDate[];
  }) => void;
}

const CreateClassroomModal: React.FC<Props> = ({
  visible,
  onClose,
  onCreate,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formStep1] = Form.useForm();
  const [formStep2] = Form.useForm();
  const [linkOption, setLinkOption] = useState<'system' | 'manual'>('system');

  const next = () => formStep1.validateFields().then(() => setCurrentStep(1));
  const prev = () => setCurrentStep(0);

  const handleFinish = async () => {
    const step1 = await formStep1.validateFields();
    const step2 = await formStep2.validateFields();
    const payload = {
      name: step1.name,
      recurrence: step1.recurrence,
      linkOption,
      manualLink: step1.manualLink,
      extraProfessor: step1.extraProfessor,
      dates: step2.dates as ClassroomDate[],
    };
    if (onCreate) onCreate(payload);
    // reset
    formStep1.resetFields();
    formStep2.resetFields();
    setLinkOption('system');
    setCurrentStep(0);
    onClose();
  };

  return (
    <Modal
      title="Nova Sala de Aula"
      visible={visible}
      footer={null}
      width={600}
      onCancel={onClose}
    >
      <Steps current={currentStep} size="small">
        <Step title="Informações Básicas" />
        <Step title="Datas & Horários" />
      </Steps>

      <div style={{ marginTop: 24 }}>
        {currentStep === 0 && (
          <Form form={formStep1} layout="vertical">
            <Form.Item
              name="name"
              label="Nome da Sala"
              rules={[{ required: true, message: 'Informe um nome' }]}
            >
              <Input placeholder="Ex: Sala de Matemática" />
            </Form.Item>

            <Form.Item
              name="recurrence"
              label="Recorrência"
              rules={[{ required: true, message: 'Selecione a recorrência' }]}
            >
              <Select placeholder="Semanal, Quinzenal ou Mensal">
                <Select.Option value="semanal">Semanal</Select.Option>
                <Select.Option value="quinzenal">Quinzenal</Select.Option>
                <Select.Option value="mensal">Mensal</Select.Option>
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
              label="Email de Professor Extra (opcional)"
            >
              <Input placeholder="email@exemplo.com" />
            </Form.Item>

            <div style={{ textAlign: 'right' }}>
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                Cancelar
              </Button>
              <Button type="primary" onClick={next}>
                Próximo
              </Button>
            </div>
          </Form>
        )}

        {currentStep === 1 && (
          <Form form={formStep2} layout="vertical">
            <Form.List name="dates" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      style={{ display: 'flex', gap: 8, marginBottom: 12 }}
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, 'date']}
                        fieldKey={[field.fieldKey, 'date']}
                        rules={[{ required: true, message: 'Selecione a data' }]}
                      >
                        <DatePicker />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'start']}
                        fieldKey={[field.fieldKey, 'start']}
                        rules={[{ required: true, message: 'Hora início' }]}
                      >
                        <TimePicker format="HH:mm" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'end']}
                        fieldKey={[field.fieldKey, 'end']}
                        rules={[{ required: true, message: 'Hora término' }]}
                      >
                        <TimePicker format="HH:mm" />
                      </Form.Item>
                      <Button
                        type="link"
                        danger
                        onClick={() => remove(field.name)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                  <Form.Item>
                    <Button block type="dashed" onClick={() => add()}>
                      + Adicionar Data
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <div style={{ textAlign: 'right' }}>
              <Button onClick={prev} style={{ marginRight: 8 }}>
                Anterior
              </Button>
              <Button type="primary" onClick={handleFinish}>
                Criar Sala
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default CreateClassroomModal;