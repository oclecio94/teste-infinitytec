# Projeto de Teste Técnico - Desenvolvedor Full Stack

Este é um projeto desenvolvido como parte de um teste técnico para a vaga de desenvolvedor Full Stack com foco em backend. Ele inclui funcionalidades de autenticação, um sistema de transações financeiras, gerenciamento de filas com BullMQ, documentação com Swagger, e suporte para execução local e via Docker.

## Estrutura do projeto

- src/modules/auth: Módulo de autenticação.
- src/modules/transaction: Módulo de transações financeiras.
- src/modules/report: Módulo de relatórios.
- src/modules/bull-board: Módulo do painel de filas.
- prisma/schema.prisma: Configuração do banco de dados.

## Funcionalidades

### 1. Autenticação

- Registro de usuários (`POST /auth/signup`)
- Login (`POST /auth/signin`)

### 2. Sistema de Transações

- Depósito: Adicionar valores ao saldo do usuário (`POST /transaction/deposit/:userId`, corpo: `{ "amount": number }`)
- Saque: Remover valores do saldo do usuário (`POST /transaction/withdraw/:userId`, corpo: `{ "amount": number }`)
- Transferência: Transferir valores entre usuários (`POST /transaction/transfer/:userId/:targetUserId`, corpo: `{ "amount": number }`)

### 3. Gerenciamento de Filas

- BullMQ processa transações de forma assíncrona.
- Geração de relatórios diários.
- Painel de monitoramento Bull-Board acessível em `/admin/queues`.

### 4. Documentação das Rotas

- Documentação com Swagger disponível em `/docs`.

### 5. Seeds para Banco de Dados

- Seeds para popular o banco de dados com dados de exemplo.
- Rodar com o comando: `npm run seed`.

## Tecnologias Utilizadas

- **NestJS**: Framework backend.
- **TypeScript**: Linguagem utilizada.
- **PostgreSQL**: Banco de dados relacional.
- **BullMQ**: Gerenciamento de filas.
- **Swagger**: Documentação de rotas.
- **Docker**: Containerização.

## Configuração do Projeto

- obs: se estiver usando o redis localmente no app.module coloque "localhost", se estiver usando docker coloque "redis"
- e no postgres local na variável de ambiente DATABASE_URL coloque "localhost", se estiver usando docker coloque "postgres"

### 1. Rodando Localmente

#### Pré-requisitos

- Node.js (versão 20+)
- Gerenciador de pacotes `npm`
- PostgreSQL
- Redis

#### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/oclecio94/teste-infinitytec.git
   cd teste-infinitytec
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

#### Crie um arquivo .env na raiz do projeto com as seguintes variáveis

- POSTGRES_USER=
- POSTGRES_PASSWORD
- POSTGRES_DB=
- DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
- SECRET_KEY=

4. Rode as migrations:

   ```bash
   npm run prisma:migrate
   ```

5. Popule o banco de dados com dados de exemplo:

   ```bash
   npm run seed
   ```

6. Inicie o servidor:

   ```bash
   npm run start:dev
   ```

7. Acesse a aplicação:

- Swagger: http://localhost:3000/docs
- Bull-Board: http://localhost:3000/admin/queues

### 2. Rodando com Docker

#### Pré-requisitos

- Docker
- Docker Compose

#### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/oclecio94/teste-infinitytec.git
   cd teste-infinitytec
   ```

2. Configure as variáveis de ambiente:

#### Crie um arquivo .env na raiz do projeto com as seguintes variáveis

- POSTGRES_USER=
- POSTGRES_PASSWORD
- POSTGRES_DB=
- DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
- SECRET_KEY=

3. Suba os containers:

   ```bash
   docker-compose up
   ```

4. Após subir os containers, você pode rodar as migrations e seeds utilizando os comandos abaixo. Certifique-se de que o container da aplicação esteja em execução.

   ```bash
   docker exec -it nest-api sh
   ```

5. Rode as migrations:

   ```bash
   npm run prisma:migrate
   ```

6. Popule o banco de dados com dados de exemplo:

   ```bash
   npm run seed
   ```

7. Inicie o servidor:

   ```bash
   npm run start:dev
   ```

8. Acesse a aplicação:

- Swagger: http://localhost:3000/docs
- Bull-Board: http://localhost:3000/admin/queues
