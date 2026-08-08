import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import subscriptionsRoutes from './routes/subscriptionsRoutes';
import billSplitRoutes from './routes/billSplitRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import settingsRoutes from './routes/settingsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Health Check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/bill-splits', billSplitRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 FinanceBudgeting Backend running on http://localhost:${PORT}`);
});

export default app;
