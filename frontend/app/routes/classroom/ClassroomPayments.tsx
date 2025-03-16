import React, { useState } from 'react';
import { Form, Input, Button, Select, Radio, Divider } from 'antd';

const ClassroomPayments: React.FC = () => {
  const [linkOption, setLinkOption] = useState<string>('system');

  const handleBillingSubmit = (values: any) => {
    console.log('Configuração de cobrança:', values);
    // Envie esses valores para a API ou atualize o estado global
  };

  const handleLinkSubmit = (values: any) => {
    console.log('Configuração do link:', values);
    // Envie esses valores para a API ou atualize o estado global
  };

  return (
    <div style={{ maxWidth: '500px', margin: 0, textAlign: 'left' }}>
      {/* Formulário de Configuração de Frequência de Cobrança */}
      <h3>Configuração de Frequência de Cobrança</h3>
      <Form layout="vertical" onFinish={handleBillingSubmit}>
        <Form.Item
          label="Frequência de Cobrança"
          name="frequency"
          rules={[{ required: true, message: 'Selecione a frequência' }]}
        >
          <Select placeholder="Selecione a frequência">
            <Select.Option value="semanal">Semanal</Select.Option>
            <Select.Option value="quinzenal">Quinzenal</Select.Option>
            <Select.Option value="mensal">Mensal</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Valor Cobrado"
          name="value"
          rules={[{ required: true, message: 'Insira o valor cobrado' }]}
        >
          <Input placeholder="Valor cobrado" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Salvar Configuração
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: '24px 0' }} />

      {/* Formulário de Configuração do Link da Sala de Aula */}
      <h3>Configuração do Link da Sala de Aula</h3>
      <Form layout="vertical" onFinish={handleLinkSubmit}>
        <Form.Item
          label="Configuração do Link"
          name="linkOption"
          rules={[{ required: true, message: 'Selecione uma opção' }]}
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
            label="Link da Sala de Aula"
            name="classroomLink"
            rules={[{ required: true, message: 'Insira o link da sala de aula' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Salvar Link
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ClassroomPayments;
