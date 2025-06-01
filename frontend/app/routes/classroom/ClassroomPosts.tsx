// src/routes/classroom/ClassroomPosts.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, List, Card, message } from 'antd';
import type { Post, ClassDate } from './types';
import {
  getPostsByClassroom,
  createPost,
  updatePost,
  deletePost,
} from '../../services/postService';

interface ClassroomPostsProps {
  scheduledClasses: ClassDate[];
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

const ClassroomPosts: React.FC<ClassroomPostsProps> = ({ scheduledClasses }) => {
  const { id: classroomId } = useParams();
  const [form] = Form.useForm();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    if (!classroomId) return;
    getPostsByClassroom(classroomId)
      .then(setPosts)
      .catch(() => message.error('Erro ao carregar posts'));
  }, [classroomId]);

  const onFinish = async (values: { postText: string }) => {
    if (!classroomId) return;
    try {
      const newPost = await createPost(values.postText, classroomId);
      setPosts((prev) => [newPost, ...prev]);
      form.resetFields();
    } catch {
      message.error('Erro ao criar post');
    }
  };

  const handleSaveEdit = async (id: string, newText: string) => {
    try {
      await updatePost(id, newText);
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...post, text: newText } : post))
      );
      setEditingPostId(null);
      setEditingText('');
    } catch {
      message.error('Erro ao atualizar post');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch {
      message.error('Erro ao excluir post');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Coluna Esquerda: Formulário + Feed */}
      <div style={{ flex: 2 }}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Nova Postagem" name="postText">
            <Input.TextArea placeholder="Digite seu post..." rows={3} />
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
          renderItem={(post) => (
            <List.Item
              key={post.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#dff0d8',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '10px',
              }}
            >
              <div style={{ flex: 1 }}>
                {editingPostId === post.id ? (
                  <Input.TextArea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={2}
                  />
                ) : (
                  <span>{post.text}</span>
                )}
              </div>
              <div>
                {editingPostId === post.id ? (
                  <>
                    <Button type="link" onClick={() => handleSaveEdit(post.id, editingText)}>
                      Salvar
                    </Button>
                    <Button
                      type="link"
                      onClick={() => {
                        setEditingPostId(null);
                        setEditingText('');
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
                        setEditingPostId(post.id);
                        setEditingText(post.text);
                      }}
                    >
                      Editar
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(post.id)}>
                      Excluir
                    </Button>
                  </>
                )}
              </div>
            </List.Item>
          )}
        />
      </div>

      {/* Coluna Direita: Card Rosa + Botão Google */}
      <div style={{ flex: 1 }}>
        <Card
          style={{
            background: '#ffe6f2',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '20px',
          }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ padding: '10px' }}>
            <h4>Próximas Aulas</h4>
            <List
              dataSource={scheduledClasses}
              renderItem={(item) => {
                const formattedDate = formatDate(item.date);
                return (
                  <List.Item style={{ padding: '4px 0' }}>
                    {`${formattedDate} ${item.startHour} - ${item.finalHour}`}
                  </List.Item>
                );
              }}
            />
          </div>
        </Card>
        <Button
          type="primary"
          onClick={() => window.open('https://google.com.br', '_blank')}
          style={{ width: '100%' }}
        >
          Ir para Google
        </Button>
      </div>
    </div>
  );
};

export default ClassroomPosts;
