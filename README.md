# 🗳️ VoterApp — Modern Voter Registry & Electoral Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-Neon_Postgres-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

An enterprise-grade, high-performance digital voter records management and civic analytics platform built with **Next.js 16 (App Router)**, **React 19**, **Prisma ORM**, and **Neon Serverless PostgreSQL**. Engineered for election authorities, municipal councils, and civic institutions to handle citizen enrollment, voter card generation, territorial demographic analytics, and batch record operations.

---

## 🌟 Key Features

- **🔍 Comprehensive Voter Directory**: Real-time fuzzy searching by Voter ID, citizen name, serial number, and multi-tier filtering by District, Upazila, Union, Ward, and Registration Status.
- **🪪 Digital Voter ID Card Generator**: Interactive card preview and export modal generating formatted citizen ID passes with photo, biographical data, and area barcodes.
- **📊 Territorial & Demographic Analytics**: Real-time analytics dashboards providing ward-wise population breakdowns, gender distribution ratios, and voter activity status (active, transferred, deceased).
- **⚡ Batch Data Import & Export**: One-click bulk voter onboarding with JSON schema validation, error detection, and rapid database synchronization.
- **🛡️ Secure Administrative Control Center**: Dedicated administrative interface with expandable drawer panels, detailed audit views, database reset, and automated backup mechanisms.
- **⚡ Serverless-Optimized Database Pipeline**: Ultra-low latency database access powered by Prisma ORM and Neon Serverless connection pooling.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router & Server Actions) |
| **UI & Components** | React 19, Tailwind CSS, Lucide Icons |
| **Type Safety** | TypeScript 5+ |
| **ORM & Database** | Prisma Client, Neon Serverless PostgreSQL |
| **State & Context** | React Context API (`AuthContext`) |
| **Linting & Quality** | ESLint 9 |

---

## 📁 Architecture & Directory Structure

```plaintext
voterapp/
├── prisma/
│   └── schema.prisma          # Database schema (Voter model, indexes, relations)
├── public/                    # Static assets, SVG icons, branding
├── src/
│   ├── app/
│   │   ├── api/voters/        # REST endpoints (CRUD, batch import, reset)
│   │   ├── globals.css        # Core styling and theme tokens
│   │   ├── layout.tsx         # Root application layout
│   │   └── page.tsx           # Main voter dashboard & management page
│   ├── components/
│   │   ├── admin/             # Admin header, sidebar, analytics, backup views
│   │   ├── auth/              # Authentication and login view
│   │   ├── importer/          # JSON data import modals and parsers
│   │   ├── VoterCardGrid.tsx  # Grid view for citizen cards
│   │   ├── VoterTable.tsx     # High-density data table with sorting
│   │   ├── VoterModal.tsx     # Voter creation and editing form
│   │   └── StatsCards.tsx     # Overview metrics and indicator cards
│   ├── context/               # Application state and AuthContext
│   ├── data/                  # Seed records and fallback schemas
│   ├── lib/                   # Database client instances (Prisma)
│   ├── types/                 # TypeScript type contracts
│   └── utils/                 # Search filters and formatting utilities
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `>= 20.x`
- **npm**, **pnpm**, or **yarn**
- A **PostgreSQL** database instance (e.g. [Neon Database](https://neon.tech))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/murshedkoli-2/voterapp.git
   cd voterapp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```

4. **Synchronize Database Schema**:
   ```bash
   npx prisma db push
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

6. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/voters` | `GET` | Fetch paginated voter list with search & filter parameters |
| `/api/voters` | `POST` | Register a new citizen voter record |
| `/api/voters/[id]` | `GET` | Retrieve detailed record for a specific voter ID |
| `/api/voters/[id]` | `PUT` | Update existing voter record attributes |
| `/api/voters/[id]` | `DELETE` | Permanently purge voter record from registry |
| `/api/voters/import` | `POST` | Bulk ingest voters via validated JSON schema |
| `/api/voters/reset` | `POST` | Administrative database reset and re-indexing |

---

## 📄 License

Distributed under the [MIT License](LICENSE).
