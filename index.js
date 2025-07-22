import express from 'express';
import cookieParser from 'cookie-parser';
import serverless from 'serverless-http';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import workflowRouter from './routes/workflow.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(arcjetMiddleware);


// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/subscriptions', subscriptionRouter);
// app.use('/api/v1/workflows', workflowRouter);

// app.use(errorMiddleware);

app.get('/', (req, res) => {
	console.log("📬 Root route hit");
	res.send("Welcome to the Subscription Tracker API!");
	console.log("📦 Response sent ✅");
});

let isConnected = false;
let cachedServerlessHandler = null;

const setup = async () => {
  if (!isConnected) {
    console.log("🔌 Connecting to DB...");
    await connectToDatabase();
    isConnected = true;
    console.log("✅ DB connected!");
  }

  if (!cachedServerlessHandler) {
    cachedServerlessHandler = serverless(app);
  }

  return cachedServerlessHandler;
};

export default async function vercelHandler(req, res) {
  const handler = await setup();
  return handler(req, res);
}

export { app };
