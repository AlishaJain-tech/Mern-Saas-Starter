import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/index.js';
import healthRoutes from './routes/health.routes.js';
import tenantRoutes from './routes/tenant.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import projectRoutes from './routes/project.routes.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/health', healthRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.use(errorHandler);

export default app;