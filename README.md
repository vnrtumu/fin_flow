# fin_flow

## 1. Overview

FinFlow is a modern, scalable, and secure **FinTech Platform** designed to handle complex financial workflows including KYC, document management, and loan processing. Built with a **Microservices Architecture** using **Node.js** and **NestJS**, it provides high performance, modularity, and ease of maintenance.

## 2. Architecture

FinFlow uses a **Microservices Architecture** where each core domain (Auth, Documents, KYC, Loans) runs as an independent service.

### 2.1 Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime** | Node.js | Backend Runtime Environment |
| **Framework** | **NestJS** | Main Application Framework (Modular, TypeScript) |
| **Communication** | **gRPC**, REST | Inter-service & Client communication |
| **Databases** | **PostgreSQL** (TypeORM), **Redis** | Persistent storage & Caching |
| **File System** | **AWS S3** | Scalable Object Storage |
| **Security** | **JWT**, bcrypt, OpenSSL | Authentication & Encryption |
| **Observability** | **OpenTelemetry**, Prometheus, Grafana | Tracing, Metrics, Monitoring |
| **Deployment** | Docker, Kubernetes | Containerization & Orchestration |

### 2.2 Service Breakdown

| Service | Language | Port | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **@fin_flow/api-gateway** | TypeScript | 3000 | Edge service, rate limiting, auth proxy |
| **@fin_flow/auth-service** | TypeScript | 3001 | JWT auth, user management, SSO |
| **@fin_flow/kyc-service** | TypeScript | 3002 | Identity verification, compliance |
| **@fin_flow/document-service** | TypeScript | 3003 | S3 integration, versioning |
| **@fin_flow/loan-service** | TypeScript | 3004 | Loan lifecycle, eligibility engine |
| **@fin_flow/admin-ui** | Next.js | 3005 | Admin dashboard, system management |
| **@fin_flow/public-ui** | Next.js | 3006 | Customer portal |

## 3. Folder Structure

The monorepo uses a standard Lerna-style structure:

```
fin_flow/
├── apps/                      # Application Entry Points
│   ├── api-gateway/           # API Gateway Service
│   ├── auth-service/          # Authentication Service
│   ├── kyc-service/           # KYC & Identity Service
│   ├── document-service/      # Document Management
│   ├── loan-service/          # Loan Processing
│   ├── admin-ui/              # Admin Dashboard (Next.js)
│   └── public-ui/             # Customer Portal (Next.js)
├── packages/                  # Shared Libraries
│   ├── common/                # Shared types, configs, utils
│   ├── middleware/            # gRPC/HTTP Middleware
│   ├── notification-service/  # Email, SMS, Push
│   └── utils/                 # General utilities
├── protos/                    # gRPC Proto Definitions
├── scripts/                   # Automation scripts
└── infra/                     # Infrastructure & Ops
```

## 4. Key Features

### A. Security
- **JWT-Based Authentication**: Secure token-based access control
- **RS256 Encryption**: Asymmetric keys for secure token signing
- **Encryption at Rest**: All sensitive data encrypted
- **Access Control**: Role-based access control (RBAC)

### B. Compliance
- **KYC Verification**: Multi-step identity verification
- **Document Verification**: OCR and AI-powered document validation
- **Audit Logging**: Comprehensive audit trails for all actions
- **Fraud Detection**: Real-time transaction monitoring

### C. Scalability
- **Microservices**: Independent scaling of services
- **gRPC Communication**: High-performance inter-service communication
- **Cloud Native**: Designed for Kubernetes deployment
- **Async Processing**: Queue-based processing for heavy operations

## 5. Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Docker & Docker Compose (optional)
- PostgreSQL (optional, can use Docker)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fin_flow

# Install dependencies
npm install

# Setup environment variables (copy .env.example to .env)
cp packages/common/.env.example packages/common/.env

# Start Services (Local Development)
# This will start all services using Docker Compose
docker-compose up

# Or start manually:
npm run dev
```

## 6. Services Documentation

### 6.1 API Gateway (`apps/api-gateway`)

**Purpose**: Edge service that handles client requests, rate limiting, and routing.

**Key Features**:
- **gRPC Client**: Proxies requests to microservices
- **REST Support**: Optional REST interface
- **Middleware**: Authentication, rate limiting, request validation

**Endpoints**:
```bash
# Authentication
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh

# KYC
GET    /api/v1/kyc/status
POST   /api/v1/kyc/submit

# Documents
POST   /api/v1/documents/upload
GET    /api/v1/documents/download/:id
```

**Health Check**: `GET /api/v1/health`

### 6.2 Auth Service (`apps/auth-service`)

**Purpose**: Handles user authentication, registration, and token management.

**Key Features**:
- **SSO Integration**: Supports multiple authentication providers
- **Token Management**: JWT generation and validation
- **Password Management**: Secure password hashing (bcrypt)

**gRPC Methods**:
- `SignUp(UserCredentials)`
- `Login(UserCredentials)`
- `VerifyToken(TokenRequest)`

### 6.3 KYC Service (`apps/kyc-service`)

**Purpose**: Manages identity verification and compliance workflows.

**Key Features**:
- **KYC Workflow**: Step-by-step verification process
- **Document Verification**: Integration with AI services
- **AML Screening**: Anti-Money Laundering checks
- **Liveness Detection**: Biometric verification

**gRPC Methods**:
- `GetKYCStatus(UserID)`
- `SubmitKYC(KYCData)`
- `ApproveKYC(KYCID)`

### 6.4 Document Service (`apps/document-service`)

**Purpose**: Secure document storage and retrieval.

**Key Features**:
- **S3 Integration**: Scalable object storage
- **Version Control**: Track document revisions
- **Access Control**: Fine-grained permissions
- **Encryption**: End-to-end encryption

**gRPC Methods**:
- `UploadDocument(DocumentData)`
- `GetDocument(DocumentID)`
- `DeleteDocument(DocumentID)`

## 7. Development

### Running Tests

```bash
# Run tests for all services
npm test

# Run tests for a specific service
npm run test --prefix apps/auth-service

# Run E2E tests
npx e2e-test
```

### Adding a New Service

```bash
# Create new service
npm run generate -- -c nestjs-command:new --name new-service

# Add to Docker Compose
# Add to infra/docker-compose.yml

# Update dependencies
npm install
```

## 8. Deployment

### Kubernetes

```bash
# Deploy to Kubernetes
./scripts/deploy-kubernetes.sh

# Scale services
kubectl scale deployment auth-service --replicas=3
```

### Docker Compose

```bash
# Development mode
docker-compose up

# Production mode
docker-compose -f docker-compose.prod.yml up --build
```

## 9. Troubleshooting

### Common Issues

**Port Conflicts**:
- Check `infra/docker-compose.yml`


**to stop the services:**
lsof -i :3000 -i :3001 -i :3002

**kill -9 8618 8621 8644**

**Test the Flow**:

Get a Token: Send a POST request to http://localhost:3000/api/auth/login with: {"email": "user@finflow.com", "password": "password123"}

Access Protected Route: Copy the token from the response, and send a GET request to http://localhost:3000/api/users/me with the header: Authorization: Bearer <your_token>.