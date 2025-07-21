import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from '../config/env.js';

const isPreview = process.env.VERCEL_ENV === 'preview';

// ⛔ In preview, disable Arcjet entirely
if (isPreview) {
	console.warn("🛡️ Arcjet is disabled in Vercel Preview deployments.");
}

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
            "POSTMAN"
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
