import aj from '../config/arcjet.js';

const isVercelPreview = process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'preview';

const arcjetMiddleware = async (req, res, next) => {
	if (isVercelPreview) {
		console.warn("🛡️ Arcjet is disabled in Vercel Preview");
		return next();
	}

	try {
		const decision = await aj.protect(req, { requested: 1 });

		if (decision.isDenied()) {
			if (decision.reason.isRateLimit()) {
				return res.status(429).json({ error: 'Rate limit exceeded' });
			}
			if (decision.reason.isBot()) {
				return res.status(403).json({ error: 'Bot detected' });
			}
			return res.status(403).json({ error: 'Access denied' });
		}

		next();
	} catch (error) {
		console.log(`Arcjet Middleware Error: ${error}`);
		next(error);
	}
};

export default arcjetMiddleware;
