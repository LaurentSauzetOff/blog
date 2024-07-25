import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// Middleware pour vérifier le token JWT
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("Token missing");
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err);
      return next(errorHandler(401, "Unauthorized"));
    }
    console.log("Decoded user from token:", user);
    req.user = user;
    next();
  });
};

// Middleware pour vérifier les permissions de l'utilisateur
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log('req.user.id:', req.user.id);
    console.log('req.params.id:', req.params.id);
    console.log('req.user.isAdmin:', req.user.isAdmin);
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      console.log("User not authorized to update this resource");
      return next(errorHandler(403, "You are not allowed to update this user"));
    }
  });
};
