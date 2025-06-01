// src/routes/Home.tsx
import React from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  List,
  Tabs,
  message,
} from 'antd';
import CreateClassroomModal from '../components/CreateClassroomModal';
import ParticipatingClassroomsModal from '../components/ParticipatingClassroomsModal';
import type { ClassroomDate } from '../components/CreateClassroomModal';
import { useEnrolledClassrooms, useOwnedClassrooms } from '../services/classroomQueries';

const { TabPane } = Tabs;

interface UpcomingEvent {
  time: string;
  title: string;
}

const Home: React.FC = () => {
  const stats = [
    { title: 'Total de Eventos', value: 42 },
    { title: 'Eventos Hoje', value: 5 },
    { title: 'Salas de Aula', value: 3 },
  ];

  const upcoming: UpcomingEvent[] = [
    { time: '09:00', title: 'Reunião de equipe' },
    { time: '14:30', title: 'Aula de React' },
    { time: '17:00', title: 'Revisão de código' },
  ];

  const { data: professorRooms = [], isLoading: loadingProf } = useOwnedClassrooms();
  const { data: studentRooms = [], isLoading: loadingStudent } = useEnrolledClassrooms();

  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
  const [isParticipatingModalVisible, setIsParticipatingModalVisible] = React.useState(false);

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
  };

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
        <h1 style={{ marginBottom: 24, fontSize: '2rem' }}>Dashboard Geral</h1>

        <Row justify="center" style={{ marginBottom: 32 }}>
          <Button
            type="primary"
            size="large"
            onClick={() => setIsCreateModalVisible(true)}
          >
            + Criar Nova Sala de Aula
          </Button>
        </Row>

        <Row gutter={[16, 16]}>
          {stats.map((s) => (
            <Col xs={24} sm={12} md={8} key={s.title}>
              <Card>
                <Statistic title={s.title} value={s.value} />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} md={12}>
            <Card title="Próximos Eventos">
              <List
                itemLayout="horizontal"
                dataSource={upcoming}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta title={`${item.time} — ${item.title}`} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Salas Participando">
              <Tabs defaultActiveKey="professor">
                <TabPane tab="Professor" key="professor">
                  {loadingProf ? <p>Carregando...</p> : (
                    <List
                      itemLayout="horizontal"
                      dataSource={professorRooms.slice(0, 4)}
                      renderItem={(room) => (
                        <List.Item>
                          <List.Item.Meta title={room.name} description={room.instructor} />
                        </List.Item>
                      )}
                    />
                  )}
                </TabPane>
                <TabPane tab="Aluno" key="aluno">
                  {loadingStudent ? <p>Carregando...</p> : (
                    <List
                      itemLayout="horizontal"
                      dataSource={studentRooms.slice(0, 4)}
                      renderItem={(room) => (
                        <List.Item>
                          <List.Item.Meta title={room.name} description={room.instructor} />
                        </List.Item>
                      )}
                    />
                  )}
                </TabPane>
              </Tabs>

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