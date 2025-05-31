// src/routes/Home.tsx
import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  List,
  Tabs,
} from 'antd';
import CreateClassroomModal from '../components/CreateClassroomModal';
import ParticipatingClassroomsModal from '../components/ParticipatingClassroomsModal';
import type { ClassroomDate } from '../components/CreateClassroomModal';

const { TabPane } = Tabs;

interface UpcomingEvent {
  time: string;
  title: string;
}

interface ClassroomSummary {
  name: string;
  instructor: string;
}

const Home: React.FC = () => {
  // estatísticas mockadas
  const stats = [
    { title: 'Total de Eventos', value: 42 },
    { title: 'Eventos Hoje',    value: 5  },
    { title: 'Salas de Aula',   value: 3  },
  ];

  // próximos eventos mockados
  const upcoming: UpcomingEvent[] = [
    { time: '09:00', title: 'Reunião de equipe' },
    { time: '14:30', title: 'Aula de React'      },
    { time: '17:00', title: 'Revisão de código'  },
  ];

  // mock de salas participando
  const professorRooms: ClassroomSummary[] = [
    { name: 'Sala de Matemática', instructor: 'Prof. João' },
    { name: 'Sala de Física',      instructor: 'Prof. Ana'  },
    { name: 'Sala de Química',     instructor: 'Prof. Carlos' },
    { name: 'Sala de História',    instructor: 'Prof. Maria' },
  ];
  const studentRooms: ClassroomSummary[] = [
    { name: 'Sala de Biologia',    instructor: 'Prof. Pedro' },
    { name: 'Sala de Geografia',   instructor: 'Prof. Luiza' },
    { name: 'Sala de Inglês',      instructor: 'Prof. Carla' },
    { name: 'Sala de Espanhol',    instructor: 'Prof. Marcos' },
  ];

  // controla visibilidade dos modais
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isParticipatingModalVisible, setIsParticipatingModalVisible] = useState(false);

  // callback para criação de sala
  const handleCreateClassroom = (data: {
    name: string;
    recurrence: string;
    linkOption: 'system' | 'manual';
    manualLink?: string;
    extraProfessor?: string;
    description?: string;
    dates: ClassroomDate[];
  }) => {
    console.log('Sala criada:', data);
    // aqui você poderia chamar sua API...
  };

  // total de salas participando (prof + aluno)
  const totalParticipating = professorRooms.length + studentRooms.length;

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

        {/* Botão para criar sala de aula */}
        <Row justify="center" style={{ marginBottom: 32 }}>
          <Button
            type="primary"
            size="large"
            onClick={() => setIsCreateModalVisible(true)}
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

        {/* Próximos eventos e Salas Participando */}
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {/* Próximos Eventos */}
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

          {/* Salas Participando */}
          <Col xs={24} md={12}>
            <Card title="Salas Participando">
              <Tabs defaultActiveKey="professor">
                <TabPane tab="Professor" key="professor">
                  <List
                    itemLayout="horizontal"
                    dataSource={professorRooms.slice(0, 4)}
                    renderItem={room => (
                      <List.Item>
                        <List.Item.Meta
                          title={room.name}
                          description={room.instructor}
                        />
                      </List.Item>
                    )}
                  />
                </TabPane>
                <TabPane tab="Aluno" key="aluno">
                  <List
                    itemLayout="horizontal"
                    dataSource={studentRooms.slice(0, 4)}
                    renderItem={room => (
                      <List.Item>
                        <List.Item.Meta
                          title={room.name}
                          description={room.instructor}
                        />
                      </List.Item>
                    )}
                  />
                </TabPane>
              </Tabs>

              {/* Botão centralizado e condicional */}
              {totalParticipating > 4 && (
                <Row justify="center" style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    onClick={() => setIsParticipatingModalVisible(true)}
                  >
                    Exibir todas as salas participantes
                  </Button>
                </Row>
              )}
            </Card>
          </Col>
        </Row>

        {/* Modais */}
        <CreateClassroomModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onCreate={handleCreateClassroom}
        />

        <ParticipatingClassroomsModal
          visible={isParticipatingModalVisible}
          onClose={() => setIsParticipatingModalVisible(false)}
          professorRooms={professorRooms}
          studentRooms={studentRooms}
        />
      </Card>
    </div>
  );
};

export default Home;
