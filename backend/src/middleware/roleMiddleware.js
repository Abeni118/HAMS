export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized - No role found" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }

    next();
  };
};

export const adminOnly = authorizeRoles("admin");
export const doctorOnly = authorizeRoles("doctor");
export const nurseOnly = authorizeRoles("nurse");
export const patientOnly = authorizeRoles("patient");
