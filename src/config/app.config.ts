export default () => ({
  port: parseInt(process.env.PORT, 10) || 6000,
  environment: process.env.NODE_ENV || 'development',
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: process.env.CORS_HEADERS?.split(',') || ['Content-Type', 'Authorization'],
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    path: process.env.SWAGGER_PATH || 'api/docs',
  },
  featureFlags: {
    newFeature: process.env.FEATURE_NEW_FEATURE === 'true',
    beta: process.env.FEATURE_BETA === 'true',
  }
});
