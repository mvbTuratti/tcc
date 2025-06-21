import React from 'react'
import { List, Button, Avatar } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import ReactQuill from 'react-quill'
import type { PostItem } from '../../services/postService'

interface PostListProps {
  posts: PostItem[]
  currentUserId: string
  isTeacher: boolean
  editingId: string | null
  editingText: string
  onEdit: (id: string, text: string) => void
  onCancel: () => void
  onDelete: (id: string) => void
  onSave: (id: string) => void
  onDiscussion: (id: string) => void
  onEditTextChange: (text: string) => void
}

export default function PostList({
  posts,
  currentUserId,
  isTeacher,
  editingId,
  editingText,
  onEdit,
  onCancel,
  onDelete,
  onSave,
  onDiscussion,
  onEditTextChange
}: PostListProps) {
  return (
    <div className="scrollable-feed">
      <List
        itemLayout="vertical"
        dataSource={posts}
        renderItem={post => {
          const canEditOrDelete = isTeacher || post.author?.id === currentUserId
          return (
            <List.Item
              className="post-card"
              key={post.id}
              actions={[
                canEditOrDelete && editingId === post.id ? (
                  <>
                    <Button type="link" onClick={() => onSave(post.id)}>
                      Salvar
                    </Button>
                    <Button type="link" onClick={onCancel}>
                      Cancelar
                    </Button>
                  </>
                ) : canEditOrDelete ? (
                  <>
                    <Button type="link" onClick={() => onEdit(post.id, post.text)}>
                      Editar
                    </Button>
                    <Button type="link" danger onClick={() => onDelete(post.id)}>
                      Excluir
                    </Button>
                  </>
                ) : null,
                <Button
                  key="comment"
                  type="link"
                  icon={<CommentOutlined />}
                  onClick={() => onDiscussion(post.id)}
                >
                  {post.responseCount}
                </Button>
              ]}
            >
              <div className="post-header">
                <Avatar src={post.author.picture} className="avatar" />
                <div className="author-info">
                  <span className="author-name">{post.author.name}</span>
                  <span className="timestamp">{`Atualizado em ${new Date(post.updatedAt).toLocaleString()}`}</span>
                </div>
              </div>
              {editingId === post.id ? (
                <ReactQuill
                  theme="snow"
                  value={editingText}
                  onChange={onEditTextChange}
                />
              ) : (
                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: post.text }}
                />
              )}
            </List.Item>
          )
        }}
      />
    </div>
  )
}