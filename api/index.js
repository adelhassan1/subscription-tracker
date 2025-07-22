import express from 'express';
import cookieParser from 'cookie-parser';
import serverless from 'serverless-http';

import userRouter from '../routes/user.routes.js';
import authRouter from '../routes/auth.routes.js';
import subscriptionRouter from '../routes/subscription.routes.js';
import workflowRouter from '../routes/workflow.routes.js';
import connectToDatabase from '../database/mongodb.js';
import errorMiddleware from '../middlewares/error.middleware.js';
import arcjetMiddleware from '../middlewares/arcjet.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(arcjetMiddleware);

app.get('/api/health', (req, res) => {
	console.log("✅ Health check hit");
	res.status(200).json({ status: 'ok' });
});


// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/subscriptions', subscriptionRouter);
// app.use('/api/v1/workflows', workflowRouter);

// app.use(errorMiddleware);

app.get('/', (req, res) => {
	console.log("📬 Root route hit");
	res.send("Welcome to the Subscription Tracker API!");
});

let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    console.log("🔌 Connecting to DB...");
    await connectToDatabase();
    isConnected = true;
    console.log("✅ DB connected!");
  }

  console.log("🚀 Passing to Express handler");
  return serverless(app)(req, res);
};

export default handler;

export { app };
