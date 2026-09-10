const jwt = require("jsonwebtoken");
const Farmer = require("../models/Farmer");
const Admin = require("../models/Admin");
const Officer = require("../models/Officer");

const roleModelMap = {
  farmer: Farmer,
  admin: Admin,
  officer: Officer,
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // { id, role }

      const Model = roleModelMap[decoded.role];
      const userDoc = Model ? await Model.findById(decoded.id).select("-password") : null;

      if (!userDoc) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      // Spread full profile (name, centreName, adminId, etc.) but always trust
      // id/role from the verified token itself, not the document.
      req.user = {
        ...userDoc.toObject(),
        id: decoded.id,
        role: decoded.role,
      };

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Restrict route to specific role(s)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role '${req.user.role}' is not allowed to access this resource` });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };