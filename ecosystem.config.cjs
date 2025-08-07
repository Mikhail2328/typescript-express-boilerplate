module.exports = {
  apps: [
    {
      name: 'express-api',
      script: 'dist/src/server.js',
      instances: 1,
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      }
    }
  ]
};