import express from 'express';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler';
import logger from './utils/logger';
import { specs } from './config/swagger';

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Rate limiting configuration
const rateLimitConfig = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`, 'RATE_LIMIT');
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      status: 429,
    });
  },
});

// Rate limiting middleware
app.use(rateLimitConfig);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: 'TypeScript Express Boilerplate API'
}));

// Swagger JSON endpoint
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
app.use('/api/v1/users', userRoutes);

// Handle 404 for undefined routes
app.use('*', (req, res) => {
    logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, 'ROUTE');
    res.status(404).json({
        success: false,
        message: 'Route not found',
        status: 404,
        path: req.originalUrl,
        method: req.method
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;