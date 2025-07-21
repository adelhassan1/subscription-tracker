import mongoose from "mongoose";
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';


export const signUp = async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// Create a new user
		const { name, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		
		if (existingUser) {
			const err = new Error('User already exists');
			err.statusCode = 409;
			next(err);
		};

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });
		const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

		await session.commitTransaction();
		session.endSession();

		res.status(201).json({
			success: true,
			message: 'User created successfully',
			data: {
				token: token,
				user: newUsers[0],
			},
		});

	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
}

export const signIn = async (req, res, next) => {
	try {

		const { email, password } = req.body;
		
		const user = await User.findOne({ email });
		
		if (!user) {
			const err = new Error('User not found');
			err.statusCode = 404;
			next(err);
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			const err = new Error('Invalid password');
			err.statusCode = 401;
			next(err);
		};

		const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

		res.status(200).json({
			success: true,
			message: 'User signed in successfully',
			data: {
				token,
				user,
			},
		});
	} catch (error) {
		next(error);
	}
}

export const signOut = async (req, res, next) => {

}