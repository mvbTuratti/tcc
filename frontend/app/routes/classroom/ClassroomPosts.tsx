import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useParams } from 'react-router-dom'
import {
  Avatar,
  Button,
  Form,
  Input,
  List,
  Modal,
  message,
  Card
} from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import {
  getPostsWithRelations,
  getPostWithResponses,
  createPost,
  updatePost,
  deletePost,
  createResponse
} from '../../services/postService'
import type {
  PostItem,
  PostWithResponses,
  ResponseItem
} from '../../services/postService'

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }],
    ['link'],
    ['clean']
  ]
}
const quillFormats = ['bold', 'italic', 'underline', 'strike', 'color', 'link']

// --- INÍCIO DOS NOVOS OBJETOS DE ESTILO ---

const pageStyle: React.CSSProperties = {
  display: 'flex',
  gap: 24,
  width: '100%',
  margin: '0 auto'
}

const feedColumnStyle: React.CSSProperties = {
  flex: 2,
  display: 'flex',
  flexDirection: 'column',
  minWidth: '300px'
}

const createPostCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  padding: '16px',
  marginBottom: '24px'
}

const scrollableFeedStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  paddingRight: '8px',
  maxHeight: 'calc(100vh - 465px)' // Ajuste dinâmico da altura
}

const postCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  padding: '16px',
  marginBottom: '16px' // Espaçamento entre os posts
}

const postHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px'
}

const avatarStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  marginRight: '12px'
}

const authorInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column'
}

const authorNameStyle: React.CSSProperties = {
  fontWeight: 600,
  color: '#050505'
}

const timestampStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#65676b'
}

const postContentStyle: React.CSSProperties = {
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
  marginTop: '8px'
}

const sidebarStyle: React.CSSProperties = {
  flex: 1,
  minWidth: '280px'
}

const nextClassesCardStyle: React.CSSProperties = {
  marginBottom: 16,
  borderRadius: '8px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  position: 'sticky',
  top: '20px'
}

const googleButtonStyle: React.CSSProperties = {
  backgroundColor: '#4285F4',
  color: 'white',
  fontWeight: 500,
  border: 'none',
  borderRadius: '4px',
  height: '40px'
}

// --- FIM DOS NOVOS OBJETOS DE ESTILO ---

export default function ClassroomPosts({
  scheduledClasses,
  onExternalLink
}: {
  scheduledClasses: { date: string; startHour: string; finalHour: string }[]
  onExternalLink: (href: string) => void
}) {
  const { id: classroomId } = useParams<{ id: string }>()
  const [form] = Form.useForm()
  const [respForm] = Form.useForm()
  const [posts, setPosts] = useState<PostItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [discussion, setDiscussion] = useState<PostWithResponses | null>(null)
  const [discVisible, setDiscVisible] = useState(false)

  useEffect(() => {
    if (!classroomId) return
    getPostsWithRelations(classroomId)
      .then(setPosts)
      .catch(() => message.error('Erro ao carregar posts'))
  }, [classroomId])

  const onAdd = async ({ postText }: { postText: string }) => {
    if (!classroomId) return
    try {
      const p = await createPost(postText, classroomId)
      setPosts(pr => [p, ...pr])
      form.resetFields()
    } catch {
      message.error('Erro ao criar post')
    }
  }

  const onSaveEdit = async (id: string) => {
    try {
      await updatePost(id, editingText)
      setPosts(pr =>
        pr.map(p => (p.id === id ? { ...p, text: editingText } : p))
      )
      setEditingId(null)
      setEditingText('')
    } catch {
      message.error('Erro ao atualizar post')
    }
  }

  const onDelete = async (id: string) => {
    try {
      await deletePost(id)
      setPosts(pr => pr.filter(p => p.id !== id))
    } catch {
      message.error('Erro ao excluir post')
    }
  }

  const openDiscussion = async (postId: string) => {
    try {
      const d = await getPostWithResponses(postId)
      setDiscussion(d)
      setDiscVisible(true)
    } catch {
      message.error('Erro ao carregar discussão')
    }
  }

  const onSubmitResponse = async ({ respText }: { respText: string }) => {
    if (!discussion) return
    try {
      await createResponse(discussion.id, respText)
      const d = await getPostWithResponses(discussion.id)
      setDiscussion(d)
      respForm.resetFields()
    } catch {
      message.error('Erro ao enviar resposta')
    }
  }

  return (
    <>
      <div style={pageStyle}>
        {/* Coluna de posts */}
        <div style={feedColumnStyle}>
          {/* Card de criação de post */}
          <div style={createPostCardStyle}>
            <Form form={form} layout="vertical" onFinish={onAdd}>
              <Form.Item
                name="postText"
                rules={[{ required: true, message: 'Escreva algo antes!' }]}
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

          {/* Feed de posts com scroll */}
          <div style={scrollableFeedStyle}>
            <List
              itemLayout="vertical"
              dataSource={posts}
              renderItem={post => (
                // O List.Item agora funciona como nosso post-card
                <List.Item
                  style={postCardStyle}
                  key={post.id}
                  actions={[
                    editingId === post.id ? (
                      <>
                        <Button type="link" onClick={() => onSaveEdit(post.id)}>
                          Salvar
                        </Button>
                        <Button
                          type="link"
                          onClick={() => {
                            setEditingId(null)
                            setEditingText('')
                          }}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="link"
                          onClick={() => {
                            setEditingId(post.id)
                            setEditingText(post.text)
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          type="link"
                          danger
                          onClick={() => onDelete(post.id)}
                        >
                          Excluir
                        </Button>
                      </>
                    ),
                    <Button
                      key="comment"
                      type="link"
                      icon={<CommentOutlined />}
                      onClick={() => openDiscussion(post.id)}
                    >
                      {post.responseCount}
                    </Button>
                  ]}
                >
                  {/* Removido o List.Item.Meta para usar um header customizado */}
                  <div style={postHeaderStyle}>
                    <Avatar src={post.author.picture} style={avatarStyle} />
                    <div style={authorInfoStyle}>
                      <span style={authorNameStyle}>{post.author.name}</span>
                      <span style={timestampStyle}>{`Atualizado em ${new Date(
                        post.updatedAt
                      ).toLocaleString()}`}</span>
                    </div>
                  </div>

                  {editingId === post.id ? (
                    <ReactQuill
                      theme="snow"
                      modules={quillModules}
                      formats={quillFormats}
                      value={editingText}
                      onChange={setEditingText}
                    />
                  ) : (
                    <div
                      style={postContentStyle}
                      dangerouslySetInnerHTML={{ __html: post.text }}
                    />
                  )}
                </List.Item>
              )}
            />
          </div>
        </div>

        {/* Coluna de próximas aulas e botão externo */}
        <div style={sidebarStyle}>
          <Card
            size="small"
            title="Próximas Aulas"
            style={nextClassesCardStyle}
          >
            <List
              size="small"
              dataSource={scheduledClasses}
              renderItem={c => (
                <List.Item>
                  {`${new Date(c.date).toLocaleDateString()} ${c.startHour}–${
                    c.finalHour
                  }`}
                </List.Item>
              )}
            />
          </Card>
          <Button
            type="primary"
            block
            style={googleButtonStyle}
            onClick={() => onExternalLink('https://google.com.br')}
          >
            Ir para Google
          </Button>
        </div>
      </div>

      <Modal
        title="Discussão"
        visible={discVisible}
        onCancel={() => setDiscVisible(false)}
        footer={null}
        width={800}
      >
        {discussion && (
          <>
            <List.Item.Meta
              avatar={<Avatar src={discussion.author.picture} />}
              title={discussion.author.name}
              description={`Atualizado em ${new Date(
                discussion.updatedAt
              ).toLocaleString()}`}
            />
            <div
              style={{ margin: '16px 0' }}
              dangerouslySetInnerHTML={{ __html: discussion.text }}
            />
            <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
              <List
                header={`${discussion.responses.length} respostas`}
                dataSource={discussion.responses}
                renderItem={r => (
                  <List.Item key={r.id}>
                    <List.Item.Meta
                      avatar={<Avatar src={r.author.picture} />}
                      title={r.author.name}
                      description={`Atualizado em ${new Date(
                        r.updatedAt
                      ).toLocaleString()}`}
                    />
                    <div dangerouslySetInnerHTML={{ __html: r.text }} />
                  </List.Item>
                )}
              />
            </div>
            <Form
              form={respForm}
              layout="vertical"
              onFinish={onSubmitResponse}
              style={{ marginTop: 16 }}
            >
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
    </>
  )
}