import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import { Modal } from 'antd'
import 'react-quill/dist/quill.snow.css'
import { useParams } from 'react-router-dom'
import { Form, Button, List, Card, message, Input } from 'antd'
import type { Post, ClassDate } from './types'
import { getPostsByClassroom, createPost, updatePost, deletePost } from '../../services/postService'

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }],
    ['link'],
    ['clean']
  ]
}

const quillFormats = [
  'bold', 'italic', 'underline', 'strike',
  'color',
  'link'
]

const handlePostClick = (e: React.MouseEvent<HTMLDivElement>) => {
  const anchor = (e.target as HTMLElement).closest('a')
  if (!anchor) return

  let href = anchor.getAttribute('href')!
  if (!href.startsWith('http')) href = 'https://' + href

  const isExternal =
    /^https?:\/\//.test(href) &&
    !href.includes(window.location.host)

  if (isExternal) {
    e.preventDefault()
    Modal.confirm({
      title: 'Você está saindo do ambiente',
      content: 'Será aberto um site externo. Deseja continuar?',
      onOk: () => window.open(href, '_blank'),
    })
  }
}

interface ClassroomPostsProps {
  scheduledClasses: ClassDate[]
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

const ClassroomPosts: React.FC<ClassroomPostsProps> = ({ scheduledClasses }) => {
  const { id: classroomId } = useParams()
  const [form] = Form.useForm()
  const [posts, setPosts] = useState<Post[]>([])
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    if (!classroomId) return
    getPostsByClassroom(classroomId)
      .then(setPosts)
      .catch(() => message.error('Erro ao carregar posts'))
  }, [classroomId])

  const onFinish = async (values: { postText: string }) => {
    if (!classroomId) return
    try {
      const newPost = await createPost(values.postText, classroomId)
      setPosts(prev => [newPost, ...prev])
      form.resetFields()
    } catch {
      message.error('Erro ao criar post')
    }
  }

  const handleSaveEdit = async (id: string, newText: string) => {
    try {
      await updatePost(id, newText)
      setPosts(prev =>
        prev.map(p => (p.id === id ? { ...p, text: newText } : p))
      )
      setEditingPostId(null)
      setEditingText('')
    } catch {
      message.error('Erro ao atualizar post')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id)
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch {
      message.error('Erro ao excluir post')
    }
  }

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ flex: 2 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="postText"
            rules={[{ required: true, message: 'Escreva algo antes de postar!' }]}
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

        <List
          itemLayout="vertical"
          dataSource={posts}
          renderItem={post => (
            <List.Item
              key={post.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                background: '#f0f0f0',
                padding: 10,
                borderRadius: 4,
                marginBottom: 10
              }}
              actions={[
                editingPostId === post.id
                  ? <>
                      <Button type="link" onClick={() => handleSaveEdit(post.id, editingText)}>
                        Salvar
                      </Button>
                      <Button type="link" onClick={() => { setEditingPostId(null); setEditingText('') }}>
                        Cancelar
                      </Button>
                    </>
                  : <>
                      <Button type="link" onClick={() => { setEditingPostId(post.id); setEditingText(post.text) }}>
                        Editar
                      </Button>
                      <Button type="link" danger onClick={() => handleDelete(post.id)}>
                        Excluir
                      </Button>
                    </>
              ]}
            >
              <div style={{ flex: 1 }}>
              {editingPostId === post.id ? (
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  value={editingText}
                  onChange={setEditingText}
                />
              ) : (
              <div
                dangerouslySetInnerHTML={{ __html: post.text }}
                onClick={handlePostClick}
              />
              )}
              </div>
            </List.Item>
          )}
        />
      </div>

      <div style={{ flex: 1 }}>
        <Card
          style={{ background: '#ffe6f2', borderRadius: 8, padding: 10, marginBottom: 20 }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ padding: 10 }}>
            <h4>Próximas Aulas</h4>
            <List
              dataSource={scheduledClasses}
              renderItem={item => (
                <List.Item style={{ padding: '4px 0' }}>
                  {`${formatDate(item.date)} ${item.startHour} - ${item.finalHour}`}
                </List.Item>
              )}
            />
          </div>
        </Card>
        <Button
          type="primary"
          style={{ width: '100%' }}
          onClick={() => {
            Modal.confirm({
              title: 'Você está saindo do ambiente',
              content: 'Será aberto a aula em nova aba. Deseja continuar?',
              onOk: () => window.open('https://google.com.br', '_blank'),
            })
          }}
        >
          Assistir Aula
        </Button>
      </div>
    </div>
  )
}

export default ClassroomPosts