import React from 'react'
import { Form, Button } from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }],
    ['link'],
    ['clean']
  ]
}
const quillFormats = ['bold', 'italic', 'underline', 'strike', 'color', 'link']

export default function PostForm({ form, onAdd }: { form: any; onAdd: (v: { postText: string }) => void }) {
  return (
    <div className="create-post-card">
      <Form form={form} layout="vertical" onFinish={onAdd}>
        <Form.Item name="postText" rules={[{ required: true, message: 'Escreva algo antes!' }]}
        >
          <ReactQuill
            theme="snow"
            modules={quillModules}
            formats={quillFormats}
            placeholder="Digite seu post..."
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Postar
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}