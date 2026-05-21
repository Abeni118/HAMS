import { authorizeRoles } from "./roleMiddleware.js";
import { protectRoute } from "./protectRoute.js";

// Ensure user is logged in AND is an admin
export const isAdmin = [protectRoute, authorizeRoles("admin")];
