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
import dayjs from 'dayjs';
import CreateClassroomModal from '../components/CreateClassroomModal';
import ParticipatingClassroomsModal from '../components/ParticipatingClassroomsModal';
import { useOwnedClassrooms, useEnrolledClassrooms, createClassroom } from '../services/classroomQueries';
import { useEvents } from  '../services/eventQueries'

const { TabPane } = Tabs;

interface UpcomingEvent {
  time: string;
  title: string;
}

interface ClassroomSummary {
  id: string;
  name: string;
  instructor: string;
}

const Home: React.FC = () => {
  const {
    data: professorRooms = [],
    isLoading: loadingProf,
    refetch: refetchOwnedClassrooms,
  } = useOwnedClassrooms();

  const {
    data: studentRooms = [],
    isLoading: loadingStudent,
    refetch: refetchEnrolledClassrooms,
  } = useEnrolledClassrooms();

  const {
    data: allEvents = [],
    isLoading: loadingEvents,
  } = useEvents();

  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
  const [isParticipatingModalVisible, setIsParticipatingModalVisible] = React.useState(false);

  const today = dayjs().format('YYYY-MM-DD');

  const stats = [
    { title: 'Total de Eventos', value: allEvents.length },
    {
      title: 'Eventos Hoje',
      value: allEvents.filter((e) => e.attributes.event_date.startsWith(today)).length,
    },
    { title: 'Salas de Aula', value: professorRooms.length + studentRooms.length },
  ];

  const upcoming: UpcomingEvent[] = allEvents
    .filter((e) => dayjs(e.attributes.event_date).isAfter(dayjs()) || dayjs(e.attributes.event_date).isSame(dayjs(), 'day'))
    .sort((a, b) => dayjs(a.attributes.event_date).valueOf() - dayjs(b.attributes.event_date).valueOf())
    .slice(0, 3)
    .map((event) => ({
      time: event.attributes.start_time.substring(0, 5),
      title: event.attributes.description || 'Evento',
    }));

  const handleCreateClassroom = async (data: { name: string; description?: string }) => {
    try {
      await createClassroom(data.name, data.description);
      message.success('Sala criada com sucesso');
      refetchOwnedClassrooms();
      refetchEnrolledClassrooms();
    } catch (error) {
      message.error('Erro ao criar sala');
    }
  };

  const totalParticipating = professorRooms.length + studentRooms.length;

  return (
    <div className="p-8 w-[88vw]">
      <Card
        style={{
          background: '#F9FAFB',
          height: '93vh',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          overflowY: 'auto',
        }}
      >
        <h1 style={{ marginBottom: 24, fontSize: '2rem' }}>Dashboard Geral</h1>

        <Row justify="center" style={{ marginBottom: 32 }}>
          <Button type="primary" size="large" onClick={() => setIsCreateModalVisible(true)}>
            + Criar Nova Sala de Aula
          </Button>
        </Row>

        <Row gutter={[16, 16]}>
          {stats.map((s) => (
            <Col xs={24} sm={12} md={8} key={s.title}>
              <Card>
                <Statistic title={s.title} value={s.value} loading={loadingEvents && s.title.includes('Evento')} />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ minHeight: '333px', marginTop: 24 }}>
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
                  {loadingProf ? (
                    <p>Carregando...</p>
                  ) : (
                    <List
                      itemLayout="horizontal"
                      dataSource={professorRooms.slice(0, 4)}
                      renderItem={(room: ClassroomSummary) => (
                        <List.Item>
                          <List.Item.Meta title={room.name} description={room.instructor} />
                        </List.Item>
                      )}
                    />
                  )}
                </TabPane>
                <TabPane tab="Aluno" key="aluno">
                  {loadingStudent ? (
                    <p>Carregando...</p>
                  ) : (
                    <List
                      itemLayout="horizontal"
                      dataSource={studentRooms.slice(0, 4)}
                      renderItem={(room: ClassroomSummary) => (
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
                  <Button type="primary" onClick={() => setIsParticipatingModalVisible(true)}>
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
          onRefetch={() => {
            refetchOwnedClassrooms();
            refetchEnrolledClassrooms();
          }}
        />
      </Card>
    </div>
  );
};

export default Home;
