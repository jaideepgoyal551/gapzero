import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { config } from './config/env';
import apiRouter from './routes/apiRouter';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // allow Vite dev assets and fonts
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // In development, allow localhost origins
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin === config.clientUrl
      ) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'GapZero API Server',
    version: '1.0.0',
    mode: config.anthropicApiKey ? 'Claude AI Connected' : 'Simulation Mode',
  });
});

// API Routes
app.use('/api', apiRouter);

// Serve static frontend in production if built
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Centralized Error Handler
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`
🚀 GapZero Backend API Server Running!
📡 Port: ${config.port}
🌍 Environment: ${config.nodeEnv}
🤖 AI Mode: ${config.anthropicApiKey ? 'Anthropic Claude Enabled' : 'Intelligent Fallback Simulation'}
💾 Database: ${config.supabaseUrl ? 'Supabase PostgreSQL' : 'Local Isolated Storage'}
`);
});

export default app;
