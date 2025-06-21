// src/routes/classroom/ClassroomPosts.tsx
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useParams } from 'react-router-dom'
import {
  Avatar,
  Button,
  Form,
  List,
  Card,
  message
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
  PostWithResponses
} from '../../services/postService'
import PostDiscussionModal from '../../components/PostDiscussionModal'
import '../../styles/ClassroomPosts.css'

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }],
    ['link'],
    ['clean']
  ]
}
const quillFormats = ['bold', 'italic', 'underline', 'strike', 'color', 'link']

type Props = {
  scheduledClasses: { date: string; startHour: string; finalHour: string }[]
  onExternalLink: (href: string) => void
  role: 'teacher' | 'student'
  currentUserId: string
}

export default function ClassroomPosts({
  scheduledClasses,
  onExternalLink,
  role,
  currentUserId
}: Props) {
  const { id: classroomId } = useParams<{ id: string }>()
  const isTeacher = role === 'teacher'

  const [form] = Form.useForm()
  const [respForm] = Form.useForm()
  const [posts, setPosts] = useState<PostItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [discussion, setDiscussion] = useState<PostWithResponses | null>(null)
  const [discVisible, setDiscVisible] = useState(false)

  async function fetchPosts() {
    if (!classroomId) return
    try {
      const data = await getPostsWithRelations(classroomId)
      setPosts(data)
    } catch {
      message.error('Erro ao carregar posts')
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [classroomId])

  const onAdd = async ({ postText }: { postText: string }) => {
    if (!classroomId) return
    try {
      await createPost(postText, classroomId)
      form.resetFields()
      await fetchPosts()
    } catch {
      message.error('Erro ao criar post')
    }
  }

  const onSaveEdit = async (id: string) => {
    try {
      await updatePost(id, editingText)
      await fetchPosts()
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
      <div className="page">
        <div className="feedColumn">
          <div className="createPostCard">
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

          <div className="scrollableFeed">
            <List
              itemLayout="vertical"
              dataSource={posts}
              renderItem={post => {
                const isOwner = post.author.id === currentUserId
                const canEdit = isOwner
                const canDelete = isTeacher || isOwner

                return (
                  <List.Item
                    className="postCard"
                    key={post.id}
                    actions={[
                      editingId === post.id && canEdit ? (
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
                          {canEdit && (
                            <Button
                              type="link"
                              onClick={() => {
                                setEditingId(post.id)
                                setEditingText(post.text)
                              }}
                            >
                              Editar
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              type="link"
                              danger
                              onClick={() => onDelete(post.id)}
                            >
                              Excluir
                            </Button>
                          )}
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
                    <div className="postHeader">
                      <Avatar src={post.author.picture} className="avatar" />
                      <div className="authorInfo">
                        <span className="authorName">{post.author.name}</span>
                        <span className="timestamp">{`Atualizado em ${new Date(
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
                        className="postContent"
                        dangerouslySetInnerHTML={{ __html: post.text }}
                      />
                    )}
                  </List.Item>
                )
              }}
            />
          </div>
        </div>

        <div className="sidebar">
          <Card
            size="small"
            title="Próximas Aulas"
            className="nextClassesCard"
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
            className="googleButton"
            onClick={() => onExternalLink('https://google.com.br')}
          >
            Ir para Google
          </Button>
        </div>
      </div>

      <PostDiscussionModal
        visible={discVisible}
        onClose={() => setDiscVisible(false)}
        discussion={discussion}
        onSubmitResponse={onSubmitResponse}
        respForm={respForm}
      />
    </>
  )
}
