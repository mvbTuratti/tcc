import React from 'react'
import { Modal, List, Avatar, Form, Input, Button } from 'antd'
import { type PostWithResponses } from '../../../services/postService'

export default function PostDiscussionModal({
  visible,
  discussion,
  onCancel,
  onSubmitResponse,
  form
}: {
  visible: boolean
  discussion: PostWithResponses | null
  onCancel: () => void
  onSubmitResponse: (v: { respText: string }) => void
  form: any
}) {
  return (
    <Modal title="Discussão" visible={visible} onCancel={onCancel} footer={null} width={800}>
      {discussion && (
        <>
          <List.Item.Meta
            avatar={<Avatar src={discussion.author.picture} />}
            title={discussion.author.name}
            description={`Atualizado em ${new Date(discussion.updatedAt).toLocaleString()}`}
          />
          <div style={{ margin: '16px 0' }} dangerouslySetInnerHTML={{ __html: discussion.text }} />

          <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
            <List
              header={`${discussion.responses.length} respostas`}
              dataSource={discussion.responses}
              renderItem={r => (
                <List.Item key={r.id}>
                  <List.Item.Meta
                    avatar={<Avatar src={r.author.picture} />}
                    title={r.author.name}
                    description={`Atualizado em ${new Date(r.updatedAt).toLocaleString()}`}
                  />
                  <div dangerouslySetInnerHTML={{ __html: r.text }} />
                </List.Item>
              )}
            />
          </div>

          <Form form={form} layout="vertical" onFinish={onSubmitResponse} style={{ marginTop: 16 }}>
            <Form.Item
              name="respText"
              rules={[{ required: true, message: 'Digite sua resposta!' }]}
            >
              <Input.TextArea rows={3} placeholder="Sua resposta..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Enviar resposta
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  )
}
