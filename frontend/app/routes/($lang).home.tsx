// src/routes/calendar/Home.tsx

import React from 'react';
import { Row, Col, Card, Statistic, Button, List } from 'antd';

const Home: React.FC = () => {
  // Dados de exemplo — você pode substituir pelos reais vindo de API/contexto
  const stats = [
    { title: 'Total de Eventos', value: 42 },
    { title: 'Eventos Hoje',    value: 5  },
    { title: 'Próximos 7 dias', value: 12 },
    { title: 'Salas de Aula',   value: 3  },
  ];

  const upcoming = [
    { time: '09:00', title: 'Reunião de equipe' },
    { time: '14:30', title: 'Aula de React'      },
    { time: '17:00', title: 'Revisão de código'  },
  ];

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
        <h2 style={{ marginBottom: 24 }}>Bem-vindo ao Dashboard</h2>

        {/* 1) Cards de estatísticas */}
        <Row gutter={[16, 16]}>
          {stats.map((s) => (
            <Col xs={24} sm={12} md={6} key={s.title}>
              <Card>
                <Statistic title={s.title} value={s.value} />
              </Card>
            </Col>
          ))}
        </Row>

        {/* 2) Conteúdo principal em 2 colunas */}
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {/* 2.1) Lista de próximos eventos */}
          <Col xs={24} md={12}>
            <Card title="Próximos Eventos">
              <List
                itemLayout="horizontal"
                dataSource={upcoming}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${item.time} — ${item.title}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* 2.2) Ações rápidas */}
          <Col xs={24} md={12}>
            <Card title="Ações Rápidas">
              <Button
                type="primary"
                style={{ width: '100%', marginBottom: 12 }}
                onClick={() => window.location.assign('/calendar')}
              >
                Ver Calendário
              </Button>
              <Button
                type="default"
                style={{ width: '100%' }}
                onClick={() => window.location.assign('/calendar')} // ou outra rota de adicionar
              >
                Adicionar Evento
              </Button>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Home;
