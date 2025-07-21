import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
	try {
		const decision = await aj.protect(req, { requested: 1 });

		if (decision.isDenied()) {
			console.log('Decision denied:', decision);
			if (decision.reason.isRateLimit()) return res.status(429).json({ message: "Rate Limit Exceeded" });
			if (decision.reason.isBot()) return res.status(403).json({ message: 'Bot detected' });

			return res.json(403).json({ message: 'Access Denied' });
		}

		next()
	} catch (error) {
		console.log(`Arcjet Middleware Error: ${error}`);
		next(error);
	}
}

export default arcjetMiddleware;