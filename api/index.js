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
app.use(arcjetMiddleware);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
	res.send("Welcome to the Subscription Tracker API!");
});

console.log("🚀 Server is starting...");
console.log("VERCEL:", process.env.VERCEL);
console.log("VERCEL_ENV:", process.env.VERCEL_ENV);
console.log("NODE_ENV:", process.env.NODE_ENV);


// Ensure DB is connected before requests are handled
await connectToDatabase();

export default serverless(app);
export { app }; // for local dev
