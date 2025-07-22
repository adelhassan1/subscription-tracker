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

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
	res.send("Welcome to the Subscription Tracker API!");
});

let isConnected = false;

const handler = serverless(app);

export default async function(req, res) {
	console.log("🛎️ Request received at", req.url);
	try {
		if (!isConnected) {
			console.log("🔌 Connecting to DB...");
			await connectToDatabase();
			isConnected = true;
		}

		console.log("🚀 Passing to Express handler");
		return handler(req, res);
	} catch (error) {
		console.error("❌ Serverless function error:", error);
		res.status(500).send("Internal server error");
	}
}

export { app };
