import React from 'react';
import { Form, Input, Button, List, Card } from 'antd';
import type { Post, ClassDate } from './types';

interface ClassroomPostsProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  editingPostId: number | null;
  setEditingPostId: React.Dispatch<React.SetStateAction<number | null>>;
  editingText: string;
  setEditingText: React.Dispatch<React.SetStateAction<string>>;
  handlePostSubmit: (newPostText: string) => void;
  handleSaveEdit: (id: number, newText: string) => void;
  scheduledClasses: ClassDate[];
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

const ClassroomPosts: React.FC<ClassroomPostsProps> = (props) => {
  const {
    posts,
    setPosts,
    editingPostId,
    setEditingPostId,
    editingText,
    setEditingText,
    handlePostSubmit,
    handleSaveEdit,
    scheduledClasses
  } = props;

  const [form] = Form.useForm();

  // Lógica para excluir um post
  const handleDelete = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  // Ao enviar o formulário, chama handlePostSubmit
  const onFinish = (values: { postText: string }) => {
    handlePostSubmit(values.postText);
    form.resetFields();
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
                    <Button
                      type="link"
                      onClick={() => {
                        handleSaveEdit(post.id, editingText);
                        setEditingPostId(null);
                        setEditingText('');
                      }}
                    >
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
