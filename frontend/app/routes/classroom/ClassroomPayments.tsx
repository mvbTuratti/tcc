// src/routes/classroom/ClassroomPayments.tsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Input, Button, Row, Col, message, Card, QRCode, Alert } from 'antd'
import { getBilling, createBilling, type BillingAttr } from '../../services/billingService'
import './ClassroomPayments.css'

interface ClassroomPaymentsProps {
  role: 'teacher' | 'student'
  isDelinquent: boolean
}

export default function ClassroomPayments({ role, isDelinquent }: ClassroomPaymentsProps) {
  const { id: classroomId } = useParams<{ id: string }>()
  const [form] = Form.useForm()
  const [billing, setBilling] = useState<BillingAttr | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!classroomId) return
    getBilling(classroomId).then(data => {
      if (data) {
        setBilling(data)
        if (data.name || data.city || data.pix_key || data.transaction_amount) {
          form.setFieldsValue({
            name:               data.name,
            city:               data.city,
            pix_key:            data.pix_key,
            transaction_amount: data.transaction_amount
          })
        }
      }
    })
  }, [classroomId, form])

  const onFinish = async (values: any) => {
    if (!classroomId) return
    setLoading(true)
    try {
      const attrs = {
        ...values,
        classroom_id: classroomId
      }
      const saved = await createBilling(attrs)
      setBilling(saved)
      message.success('Cobrança criada com sucesso')
    } catch {
      message.error('Erro ao criar cobrança')
    } finally {
      setLoading(false)
    }
  }

  if (role === 'student' && isDelinquent) {
    return (
      <div className="payments-container">
        <Alert
          message="Sala bloqueada por pendência de pagamento"
          description="Entre em contato com o professor para regularizar sua situação."
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {billing?.qr_code && billing.transaction_amount != null && (
          <Card title="QR Code Pix" bordered className="qr-card">
            <QRCode
              value={billing.qr_code}
              size={256}
              level="H"
            />
            <p className="qr-legend">
              Escaneie para pagar R${(billing.transaction_amount ?? 0).toFixed(2)}
            </p>
          </Card>
        )}
      </div>
    )
  }

  return (
    <Row gutter={24} className="payments-container">
      <Col xs={24} sm={24} md={12}>
        {role === 'teacher' && (
          <Card title="Configuração de Cobrança" bordered>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ transaction_amount: undefined }}
            >
              <Form.Item
                label="Nome"
                name="name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Cidade"
                name="city"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Chave Pix"
                name="pix_key"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Valor da Transação"
                name="transaction_amount"
                rules={[{ required: true }]}
              >
                <Input
                  type="number"
                  min={0}
                  prefix="R$"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  {billing ? 'Atualizar' : 'Criar'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}
      </Col>

      <Col xs={24} sm={24} md={12}>
        {billing?.qr_code && billing.transaction_amount != null && (
          <Card title="QR Code Pix" bordered className="qr-card">
            <QRCode
              value={billing.qr_code}
              size={256}
              level="H"
            />
            <p className="qr-legend">
              Escaneie para pagar R${(billing.transaction_amount ?? 0).toFixed(2)}
            </p>
          </Card>
        )}
      </Col>
    </Row>
  )
}
