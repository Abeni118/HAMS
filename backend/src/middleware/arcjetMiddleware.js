import { aj } from "../lib/arcjet.js";

export const protectWithArcjet = async (req, res, next) => {
  // If Arcjet wasn't initialized (e.g. missing ARCJET_KEY), simply pass through
  if (!aj) {
    return next();
  }

  try {
    const decision = await aj.protect(req, { requested: 1 }); // Deduct 1 token

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Too many requests, please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else {
        return res.status(403).json({ message: "Access denied by security policies." });
      }
    }
    next();
  } catch (error) {
    console.error("Arcjet error:", error);
    // On failure, we log it and can either pass the request or block it.
    // Given healthcare app, maybe we pass it so legitimate users aren't locked out if Arcjet is down
    // But ideally we'd fail close. We'll pass through with an error logged.
    next(error);
  }
};
