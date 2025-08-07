# TypeScript Express Boilerplate

Node.js Express TypeScript boilerplate with rate limiting, validation, and logging features.

##  Features

- **TypeScript**: Full TypeScript support with strict configuration
- **Rate Limiting**: Request rate limiting to prevent abuse
- **Validation**: Request validation using Joi with custom error handling
- **Logging**: Colorful console logging with timestamps and tags using Chalk
- **Error Handling**: Centralized error handling with custom error classes
- **Development**: Hot reload with nodemon and SWC for fast compilation


##  Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd typescript-express-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.sample .env
   ```
   Edit the `.env` file with your configuration values.

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Other Commands
```bash
# Type checking
npm run type-check

# Clean build directory
npm run clean
```

## ️ Project Structure

```
src/
├── config/
│   └── config.ts          # Environment configuration
├── controllers/
│   └── userController.ts  # Route handlers
├── middlewares/
│   ├── errorHandler.ts    # Global error handling
│   └── validation.ts      # Request validation
├── models/
│   └── user.ts           # Data models
├── routes/
│   └── userRoutes.ts     # Route definitions
├── utils/
│   └── logger.ts         # Logging utility
├── app.ts                # Express app setup
└── server.ts             # Server startup
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.sample`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
```

## License

This project is licensed under the MIT License.