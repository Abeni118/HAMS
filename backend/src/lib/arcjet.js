import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import dotenv from "dotenv";

dotenv.config();

let aj;

if (process.env.ARCJET_KEY) {
  aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"], // Track requests by IP address
    rules: [
      // Shield protects against common attacks (e.g., SQL injection, XSS)
      shield({ mode: "LIVE" }),
      
      // Bot protection
      detectBot({
        mode: "LIVE",
        // Allow search engines and social scrapers
        allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
      }),
      
      // Rate limiting: 100 requests per 10 minutes per IP
      tokenBucket({
        mode: "LIVE",
        refillRate: 100,
        interval: 600, 
        capacity: 100,
      }),
    ],
  });
} else {
  console.warn("⚠️  ARCJET_KEY is not defined in environment variables. Arcjet protection is disabled.");
}

export { aj };
