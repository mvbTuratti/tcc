// src/routes/classroom.$id.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, Tabs, message } from 'antd';
import type { Post, Student, ClassDate } from './classroom/types';
import ClassroomPosts from './classroom/ClassroomPosts';
import ClassroomStudents from './classroom/ClassroomStudents';
import ClassroomPayments from './classroom/ClassroomPayments';
import { getEnrollmentsByClassroom } from '../services/enrollmentService';

const { TabPane } = Tabs;

const ClassroomById: React.FC = () => {
  const { id: classroomId } = useParams<{ id: string }>();
  const location = useLocation();
  const { role } = location.state as { role: 'teacher' | 'student' };

  const [students, setStudents] = useState<Student[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  const scheduledClasses: ClassDate[] = [
    { date: '2025-03-10', startHour: '15:30', finalHour: '18:00' },
    { date: '2025-03-11', startHour: '15:30', finalHour: '18:00' },
    { date: '2025-03-12', startHour: '15:30', finalHour: '18:00' },
    { date: '2025-03-13', startHour: '15:30', finalHour: '18:00' },
    { date: '2025-03-14', startHour: '15:30', finalHour: '18:00' },
    { date: '2025-03-15', startHour: '15:30', finalHour: '18:00' },
  ];

  useEffect(() => {
    if (!classroomId) return;

    // Mock: identificador simples por enquanto
    const storedUser = localStorage.getItem('userId');
    if (storedUser) setCurrentUserId(storedUser);

    getEnrollmentsByClassroom(classroomId)
      .then((lista) => {
        setStudents(lista);
        const current = lista.find(s => s.userId === storedUser);
        if (current?.isDelinquent) {
          setIsBlocked(true);
        }
      })
      .catch(() => message.error('Erro ao carregar alunos'));
  }, [classroomId]);

  return (
    <div className="p-8 w-[88vw]">
      <Card
        style={{
          background: '#F9FAFB',
          height: '93vh',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <h2 style={{ marginBottom: 16 }}>
          Sala: <code>{classroomId}</code>
        </h2>

        <Tabs defaultActiveKey="posts">
          <Tabs.TabPane tab="Posts" key="posts">
            {role === 'student' && isBlocked ? (
              <p style={{ color: 'red', fontWeight: 'bold' }}>
                Sala bloqueada por pendência de pagamento. Contate o professor.
              </p>
            ) : (
              <ClassroomPosts
                role={role}
                currentUserId={currentUserId}
                scheduledClasses={scheduledClasses}
                onExternalLink={(href) => window.open(href, '_blank')}
              />
            )}
          </Tabs.TabPane>

          <Tabs.TabPane tab="Alunos" key="alunos">
            {classroomId ? (
              <ClassroomStudents
                students={students}
                setStudents={setStudents}
                classroomId={classroomId}
                role={role}
              />
            ) : (
              <p>Carregando...</p>
            )}
          </Tabs.TabPane>

          <Tabs.TabPane tab="Pagamentos" key="pagamentos">
            <ClassroomPayments role={role} isDelinquent={isBlocked} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ClassroomById;