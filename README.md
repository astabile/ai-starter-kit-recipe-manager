# Recipe Manager - MERN Stack Application

A production-ready recipe management application built with MongoDB, Express, React, and Node.js (MERN stack) with TypeScript support.

## 🚀 Features

- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Modern Tooling**: ESLint, Prettier, Hot Reload
- **API Client**: Axios with request/response interceptors
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, Compression middleware
- **Routing**: React Router for client-side navigation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v22.x or higher recommended)
- npm (v10.x or higher)
- Docker and Docker Compose (for MongoDB)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/astabile/ai-starter-kit-recipe-manager.git
   cd ai-starter-kit-recipe-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Backend (.env in `/server`):
   ```bash
   cp server/.env.example server/.env
   ```
   
   Frontend (.env in `/client`):
   ```bash
   cp client/.env.example client/.env
   ```

4. **Start MongoDB with Docker**
   ```bash
   docker-compose up -d
   ```

## 🏃 Running the Application

### Development Mode (Both Frontend & Backend)

```bash
npm run dev
```

This will start:
- Frontend development server on `http://localhost:3000`
- Backend API server on `http://localhost:5001`
- MongoDB on `mongodb://localhost:27017`

### Run Frontend Only

```bash
npm run dev:client
```

### Run Backend Only

```bash
npm run dev:server
```

## 📁 Project Structure

```
recipe-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript type definitions
│   ├── .env.example       # Environment variables template
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Mongoose models
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Utility functions
│   │   └── config/       # Configuration files
│   ├── .env.example      # Environment variables template
│   └── package.json
│
├── docker-compose.yml    # MongoDB container config
├── package.json          # Root workspace configuration
└── README.md
```

## 🔧 Available Scripts

### Root Level

- `npm run dev` - Run both frontend and backend concurrently
- `npm run dev:client` - Run frontend only
- `npm run dev:server` - Run backend only
- `npm run build` - Build both frontend and backend
- `npm run lint` - Run ESLint on both projects
- `npm run format` - Run Prettier on both projects

### Backend (in `/server`)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier

### Frontend (in `/client`)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Check server status

## 🔒 Environment Variables

### Backend (`/server/.env`)

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/recipe-manager
```

### Frontend (`/client/.env`)

```env
VITE_API_URL=http://localhost:5001/api
```

## 🐳 Docker Commands

Start MongoDB:
```bash
docker-compose up -d
```

Stop MongoDB:
```bash
docker-compose down
```

View MongoDB logs:
```bash
docker-compose logs -f mongodb
```

## 🧪 Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Both frontend and backend share consistent ESLint and Prettier configurations.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

Your Name

## 🙏 Acknowledgments

- MERN Stack
- Vite
- Tailwind CSS
- TypeScript
