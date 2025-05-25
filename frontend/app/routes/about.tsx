import type { Route } from "./+types/home";
import { Card, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "L2L", name: "description", content: "Sobre o projeto TCC L2L" },
  ];
}

export default function About() {
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
        <Typography>
          <Title level={3}>Sobre o Projeto de TCC L2L</Title>

          <Paragraph>
            O <Text strong>Language to language (L2L)</Text> é um sistema web completo de gerenciamento de salas de aula e eventos acadêmicos, desenvolvido como Trabalho de Conclusão de Curso.
            Ele permite criar, editar e visualizar cronogramas de aulas e eventos, com suporte a:
          </Paragraph>

          <Paragraph>
            • Agendamento de eventos por data e hora,  
            <br />
            • Intervalos e recorrências (semanal, quinzenal e mensal),  
            <br />
            • Associação opcional de sala de aula (e.g. “sala de aula 1”, “sala de aula 2”),  
            <br />
            • Listagem de eventos por dia em um modal dedicado,  
            <br />
            • Edição inline de dados (data, horário, tipo de evento, sala).  
          </Paragraph>

          <Paragraph>
            O front-end é construído com <Text code>React</Text> e <Text code>Ant Design 4</Text>, apresentando:
            <br />
            – Calendário interativo com cores personalizadas para cada tipo de evento (sucesso, aviso, erro).  
            <br />
            – Modais responsivos para adição e edição de eventos.  
            <br />
            – Formulários dinâmicos com validações avançadas (datas, horários e recorrência).  
          </Paragraph>

          <Paragraph>
            No back-end, utilizamos <Text code>Elixir</Text> com <Text code>Phoenix</Text> e 
            <Text code>Ash Framework</Text> (AshJsonApi e AshPostgres) para:
            <br />
            – Modelagem de domínio (entidade <Text code>classroom</Text> com múltiplos professores),  
            <br />
            – Rotas JSON:API com upsert, listagem, leitura, atualização e exclusão,  
            <br />
            – Persistência em banco de dados via migrations e Ecto.  
          </Paragraph>

          <Paragraph>
            <Text strong>Autores:</Text>
            <br />
            • Matheus Vinicius Barcaro Turatti  
            <br />
            • Murilo Mascarin Guimarães  
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
};
