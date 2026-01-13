# Tech Stack & Build System

## Core Technologies

- **React 18.3.1**: UI framework với hooks và functional components
- **TypeScript 5.8.2**: Type safety và developer experience
- **Vite 6.2.0**: Build tool và dev server (port 3000)
- **React Router v6**: Client-side routing với lazy loading

## Backend Stack

- **Express.js**: RESTful API server (port 3001)
- **PostgreSQL**: Production database với Neon serverless
- **JWT Authentication**: bcrypt password hashing
- **Multer**: File upload middleware

## UI & Styling

- **Tailwind CSS v4**: Utility-first CSS framework (custom config)
- **Lucide React**: Icon library
- **Responsive Design**: Mobile-first approach

## State Management & Data

- **React Context API**: Global state (AuthContext, DataContext, SiteConfigContext)
- **React Hook Form + Zod**: Form handling và validation
- **PostgreSQL**: Persistent database storage

## Development Tools

- **@vitejs/plugin-react**: Vite React plugin
- **@types/node**: Node.js type definitions
- **tsx**: TypeScript execution for server

## Common Commands

### Development

```bash
npm run dev          # Start frontend dev server (http://localhost:3000)
npm run dev:server   # Start backend server (http://localhost:3001)
npm run build        # Production build
npm run preview      # Preview production build
```

### Project Setup

```bash
npm install          # Install dependencies
```

## Build Configuration

- **Vite Config**: Custom alias `@/*` pointing to project root
- **TypeScript**: ES2022 target, ESNext modules, bundler resolution
- **Environment**: GEMINI_API_KEY support for future AI integration
- **Server**: Host 0.0.0.0 for network access

## Code Style Guidelines

- **Functional Components**: Sử dụng React.FC với TypeScript
- **Lazy Loading**: Tất cả pages được lazy load
- **Context Pattern**: Centralized state management
- **API Integration**: Centralized API client trong services/api.ts
