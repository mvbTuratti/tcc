# Language to Language (L2L)

**L2L (Language to Language)** é uma plataforma para organização e condução de aulas online com foco no ensino de línguas estrangeiras. Desenvolvida como um Trabalho de Conclusão de Curso (TCC) por [Matheus Vinicius Barcaro Turatti](https://github.com/mvbTuratti) e [Murilo Mascarin Guimarães](https://github.com/mascaring), a aplicação tem como principal objetivo facilitar a interação entre professores e alunos, gerenciar eventos e aulas recorrentes, configurar links de salas e formas de cobrança.

---

## 🧠 Visão Geral

A aplicação é dividida em dois principais módulos:

- **Backend (Elixir + Phoenix + Ash Framework)**
- **Frontend (React + TypeScript + Ant Design)**

---

## 🔧 Backend

### Tecnologias:
- Elixir 1.15.4
- Erlang/OTP 26
- Phoenix 1.7.10
- Ash Framework 3.0
- PostgreSQL 15+

### Funcionalidades:
- API RESTful com suporte a autenticação e permissões
- Gestão de usuários, professores, salas e eventos
- Integração com calendário e lógica de recorrência
- Link de sala de aula configurável (manual ou automático)
- Configuração de frequência de cobrança (aula avulsa, semanal, quinzenal, mensal)
- Utiliza `mix ash.codegen` para scaffolding de recursos Ash

### Como rodar:
```bash
mix setup
mix phx.server
# ou com IEx
iex -S mix phx.server
```

Acesse em [`localhost:4000`](http://localhost:4000)

### Migrations:
```bash
mix ash.codegen resource
mix ash.setup
```

Para produção, consulte a [documentação oficial do Phoenix](https://hexdocs.pm/phoenix/deployment.html).

---

## 🎨 Frontend

### Tecnologias:
- Node.js 20.12.2
- npm 10.5.0
- Vite 5.4.11
- React 18.2.0
- Ant Design 5.24.2
- TypeScript 5.7.2
- tailwindcss 4.0

### Principais componentes:
- `CalendarMain.tsx`: calendário interativo com suporte a visualização por mês e seleção de dias
- `AddEventModal.tsx`: modal para adicionar eventos com data, hora, tipo e recorrência
- `DayEventsModal.tsx`: modal para visualizar eventos de um dia específico
- `About.tsx`: descrição do projeto e criadores

### Funcionalidades:
- Interface limpa e responsiva
- Suporte a criação de eventos no calendário
- Visualização de eventos por data
- Configuração de salas de aula e frequência de cobrança via formulários

---

## 🖥️ Tela da Sala de Aula

Inclui:
- Lista de aulas futuras
- Postagens e interações com os alunos
- Links de chamada via sistema ou personalizados
- Botão para convidar alunos
- Gestão de alunos (marcar como inadimplente, excluir, aguardar confirmação)

---

## 🚀 Como Rodar o Frontend

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Rode o projeto:
   ```bash
   npm run dev
   ```

3. Acesse em [`localhost:5173`](http://localhost:5173)

---

## 📌 Sobre os Criadores

Este projeto foi desenvolvido por:

- **Matheus Vinicius Barcaro Turatti**
- **Murilo Mascarin Guimarães**

Com o propósito de explorar tecnologias modernas para o desenvolvimento de aplicações web robustas, modulares e intuitivas para o ensino de idiomas.

---

## 📄 Licença

Este projeto é acadêmico e sem fins lucrativos. Para mais informações sobre uso e contribuição, entre em contato com os autores.