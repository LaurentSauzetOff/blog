import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from './routes/post.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Middleware pour parser les JSON
app.use(express.json());
app.use(cookieParser());

// Middleware pour gérer les CORS (si nécessaire)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("la bdd est connectée");
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données", err);
    process.exit(1); // Arrête l'application si la connexion échoue
  });

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/post', postRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("Serveur fonctionne !");
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Quelque chose a mal tourné !");
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Le serveur démarre sur le port ${PORT} !!!`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Quelque chose a mal tourné !";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
