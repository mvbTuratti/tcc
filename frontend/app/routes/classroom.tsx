import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import type { Post, Student, ClassDate } from './classroom/types'; 
// ^ Podemos centralizar as interfaces em um arquivo `types.ts` dentro da pasta `classroom` ou simplesmente
//   definir aqui mesmo. Para o exemplo, supomos que elas estejam em "types.ts".

import ClassroomPosts from './classroom/ClassroomPosts';
import ClassroomStudents from './classroom/ClassroomStudents';
import ClassroomPayments from './classroom/ClassroomPayments';

const Classroom: React.FC = () => {
  // ---------- ESTADOS (compartilhados entre as abas) ----------
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "João", email: "joao@example.com", status: "regular" },
    { id: 2, name: "Maria", email: "maria@example.com", status: "regular" },
    { id: 3, name: "Carlos", email: "carlos@example.com", status: "blocked" },
    { id: 4, name: "Ana", email: "ana@example.com", status: "blocked" },
  ]);

  const scheduledClasses: ClassDate[] = [
    { date: '2025-03-10', startHour: '15:30', finalHour: '18:00' },
    { date: '2025-03-11', startHour: '15:30', finalHour: '18:00' },
    { date: '2025-03-12', startHour: '15:30', finalHour: '18:00' },
    { date: '2025-03-13', startHour: '15:30', finalHour: '18:00' },
    { date: '2025-03-14', startHour: '15:30', finalHour: '18:00' },
    { date: '2025-03-15', startHour: '15:30', finalHour: '18:00' },
  ];

  // ---------- FUNÇÕES (podem ser passadas como props) ----------
  const handlePostSubmit = (newPostText: string) => {
    if (newPostText.trim()) {
      const newPost: Post = { id: Date.now(), text: newPostText };
      setPosts([newPost, ...posts]);
    }
  };

  const handleSaveEdit = (id: number, newText: string) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, text: newText } : post
      )
    );
  };

  // ---------- RENDERIZAÇÃO ----------
  return (
    <div className="p-8 w-[88vw]">
      <Card
        style={{
          background: 'white',
          height: '94vh',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <Tabs defaultActiveKey="posts">
          {/* Aba de POSTS */}
          <Tabs.TabPane tab="Posts" key="posts">
            <ClassroomPosts
              posts={posts}
              setPosts={setPosts}
              editingPostId={editingPostId}
              setEditingPostId={setEditingPostId}
              editingText={editingText}
              setEditingText={setEditingText}
              handlePostSubmit={handlePostSubmit}
              handleSaveEdit={handleSaveEdit}
              scheduledClasses={scheduledClasses}
            />
          </Tabs.TabPane>

          {/* Aba de ALUNOS */}
          <Tabs.TabPane tab="Alunos" key="alunos">
            <ClassroomStudents
              students={students}
              setStudents={setStudents}
            />
          </Tabs.TabPane>

          {/* Aba de PAGAMENTOS */}
          <Tabs.TabPane tab="Pagamentos" key="pagamentos">
            <ClassroomPayments />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Classroom;