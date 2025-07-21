import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from '../config/env.js';

const isVercelPreview = process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'preview';

console.log("🛡️ Arcjet Mode:", isVercelPreview ? "DISABLED (Preview)" : "ENABLED");

const aj = isPreview
	? (req, res, next) => next()
	: arcjet({
		key: ARCJET_KEY,
		characteristics: ["ip.src"],
		rules: [
        shield({ mode: "LIVE" }),
        detectBot({
			mode: "LIVE",
			allow: [
            "CATEGORY:SEARCH_ENGINE",
            "POSTMAN",
			"VERCEL_MONITOR_PREVIEW"
			],
        }),
        tokenBucket({
			mode: "LIVE",
			refillRate: 5,
			interval: 10,
			capacity: 10,
        }),
		],
    });

export default aj;
