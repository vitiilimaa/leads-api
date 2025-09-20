# Leads API

## 📖 Visão Geral
A **Leads API** é uma aplicação RESTful para gerenciamento de **leads de marketing**, **grupos** e **campanhas associadas**.  
Inclui recursos de:
- CRUD completo para Leads, Grupos e Campanhas  
- Relacionamentos entre entidades (1:N e N:N)  
- Suporte a **filtragem**, **ordenação**, **paginação**  
- Implementação com **Prisma ORM**  

## 🗂️ Modelos
![Diagrama](https://github.com/user-attachments/assets/3f103b7f-55fb-4ce4-a831-eba5307c9c71)

### **Groups**
- `id` (int, PK)  
- `name` (string, único)  
- `description` (string, opcional)  

### **Leads**
- `id` (int, PK)  
- `name` (string)  
- `email` (string, único)  
- `phone` (string, opcional)  
- `status` (enum: `Novo`, `Contatado`, `Qualificado`, `Convertido`)  

### **Campaigns**
- `id` (int, PK)  
- `name` (string)  
- `description` (string, opcional)  
- `startDate` (DateTime)  
- `endDate` (DateTime, opcional)  

### **CampaignLeads** (tabela de junção Leads ↔ Campaigns)
- `leadId` (int, FK → Leads)  
- `campaignId` (int, FK → Campaigns)  
- `status` (enum: `Interessado`, `Não Interessado`, `Em Andamento`)  

## 🚀 Endpoints da API

### **Grupos**
- `GET /groups` → Lista grupos (filtros: `name`, paginação)  
- `GET /groups/:id` → Retorna grupo por ID  
- `POST /groups` → Cria novo grupo  
- `PUT /groups/:id` → Atualiza grupo existente  
- `DELETE /groups/:id` → Remove grupo  

### **Leads**
- `GET /leads` → Lista leads (filtros: `name`, `status`, ordenação, paginação)  
- `GET /leads/:id` → Retorna lead por ID  
- `POST /leads` → Cria novo lead (associações com grupos/campanhas opcionais)  
- `PUT /leads/:id` → Atualiza lead existente  
- `DELETE /leads/:id` → Remove lead  
- `GET /groups/:id/leads` → Lista leads de um grupo específico (filtros e paginação)  

### **Campanhas**
- `GET /campaigns` → Lista campanhas (filtros: `name`, `startDate`, ordenação, paginação)  
- `GET /campaigns/:id` → Retorna campanha por ID  
- `POST /campaigns` → Cria nova campanha  

## 📦 Exemplos de Requisição

### Criar Grupo
```json
POST /groups
{
  "name": "Equipe de Marketing A",
  "description": "Leads para a equipe de marketing A"
}
```

### Criar Lead
```json
POST /leads
{
  "name": "João Silva",
  "email": "joao.silva@exemplo.com",
  "phone": "123-456-7890",
  "status": "New",
  "groups": ["grupo-uuid"],
  "campaigns": ["campanha-uuid"]
}
```

### Criar Campanha
```json
POST /campaigns
{
  "name": "Campanha Black Friday",
  "description": "Descontos especiais para leads qualificados",
  "startDate": "2025-11-01T00:00:00Z",
  "endDate": "2025-11-30T23:59:59Z"
}
```

### 🛠️ Tecnologias Utilizadas

- Node.js
- TypeScript
- Prisma ORM
- Express
- PostgreSQL
- zod

### 📌 Status do Projeto

Em desenvolvimento.
