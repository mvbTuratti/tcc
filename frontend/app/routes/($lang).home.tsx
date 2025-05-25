// src/routes/Home.tsx
import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Button, List } from 'antd';
import CreateClassroomModal from '../components/CreateClassroomModal';
import type { ClassroomDate } from '../components/CreateClassroomModal';

interface UpcomingEvent {
  time: string;
  title: string;
}

const Home: React.FC = () => {
  // estatísticas mockadas
  const stats = [
    { title: 'Total de Eventos', value: 42 },
    { title: 'Eventos Hoje',    value: 5  },
    { title: 'Salas de Aula',   value: 3  },
  ];

  // lista de próximos eventos mockada
  const upcoming: UpcomingEvent[] = [
    { time: '09:00', title: 'Reunião de equipe' },
    { time: '14:30', title: 'Aula de React'      },
    { time: '17:00', title: 'Revisão de código'  },
  ];

  // controla visibilidade do modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // callback para quando a sala for criada
  const handleCreateClassroom = (data: {
    name: string;
    recurrence: string;
    linkOption: 'system' | 'manual';
    manualLink?: string;
    extraProfessor?: string;
    dates: ClassroomDate[];
  }) => {
    console.log('Sala criada:', data);
    // aqui você pode chamar sua API para persistir a sala...
  };

  return (
    <div className="p-8 w-[88vw]">
      <Card
        style={{
          background: "#F9FAFB",
          height: '93vh',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          overflowY: 'auto',
        }}
      >
        {/* Título da página */}
        <h1 style={{ marginBottom: 24, fontSize: '2rem' }}>
          Dashboard Geral
        </h1>

        {/* Botão centralizado para criar sala de aula */}
        <Row justify="center" style={{ marginBottom: 32 }}>
          <Button
            type="primary"
            size="large"
            onClick={() => setIsModalVisible(true)}
          >
            + Criar Nova Sala de Aula
          </Button>
        </Row>

        {/* Estatísticas */}
        <Row gutter={[16, 16]}>
          {stats.map(s => (
            <Col xs={24} sm={12} md={8} key={s.title}>
              <Card>
                <Statistic title={s.title} value={s.value} />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Próximos eventos */}
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} md={12}>
            <Card title="Próximos Eventos">
              <List
                itemLayout="horizontal"
                dataSource={upcoming}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${item.time} — ${item.title}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Modal de criação de sala de aula */}
        <CreateClassroomModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onCreate={handleCreateClassroom}
        />
      </Card>
    </div>
  );
};

export default Home;
