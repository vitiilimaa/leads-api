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

### **Group**
- `id` (int, PK)  
- `name` (string, único)  
- `description` (string, opcional)  

### **Lead**
- `id` (int, PK)  
- `name` (string)  
- `email` (string, único)  
- `phone` (string, opcional)  
- `status` (enum: `New`, `Contacted`, `Qualified`, `Converted`, `Unresponsive`, `Disqualified`, `Archived`)    

### **Campaign**
- `id` (int, PK)  
- `name` (string)  
- `description` (string, opcional)  
- `startDate` (DateTime)  
- `endDate` (DateTime, opcional)  

### **GroupLead** (tabela de junção Lead ↔ Group)
- `group_id` (int, PK,  FK → Group)  
- `lead_id` (int, PK, FK → Lead)  

### **CampaignLead** (tabela de junção Lead ↔ Campaign)
- `leadId` (int, PK, FK → Lead)  
- `campaignId` (int, PK, FK → Campaign)  
- `status` (enum: `New`, `Não Engaged`, `FollowUp_Scheduled`, `Contacted`, `Qualified`, `Converted`, `Unresponsive`, `Disqualified`, `Re_Engaged`, `Opted_Out`)   
  
## 🚀 Endpoints da API

### **Leads**
- `GET /leads` → Lista leads (filtros: `name`, `status`, ordenação, paginação)  
- `GET /leads/:id` → Retorna lead por ID  
- `POST /leads` → Cria novo lead (associações com grupos/campanhas opcionais)  
- `PUT /leads/:id` → Atualiza lead existente  
- `DELETE /leads/:id` → Remove lead  

### **Grupos**
- `GET /groups` → Lista grupos  
- `GET /groups/:id` → Retorna grupo por ID  
- `POST /groups` → Cria novo grupo  
- `PUT /groups/:id` → Atualiza grupo existente  
- `DELETE /groups/:id` → Remove grupo  
- `GET /groups/:groupId/leads` → Lista leads de um grupo específico (filtros e paginação)  
- `POST /groups/:groupId/leads/:leadId` → Adiciona lead ao grupo  
- `DELETE /groups/:groupId/leads/:leadId` → Remove lead do grupo  

### **Campanhas**
- `GET /campaigns` → Lista campanhas 
- `GET /campaigns/:id` → Retorna campanha por ID  
- `POST /campaigns` → Cria nova campanha
- `PUT /campaigns/:id` → Atualiza campanha existente  
- `DELETE /campaigns/:id` → Remove campanha  
- `GET /campaigns/:campaignId/leads` → Lista leads de uma campanha específica (filtros e paginação)
- `POST /campaigns/:campaignId/leads/:leadId` → Adiciona lead à campanha  
- `DELETE /campaigns/:campaignId/leads/:leadId` → Remove lead da campanha  

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

Finalizado.
