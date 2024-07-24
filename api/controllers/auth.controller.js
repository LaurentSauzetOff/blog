import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
//import jwt from "jsonwebtoken";
import { errorHandler } from '../utils/error.js'; // Assure-toi que ce module existe et est bien importé

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validation des champs requis
  if (!username || !email || !password || username === "" || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "L'utilisateur existe déjà !"));
    }

    // Hachage du mot de passe
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Création d'un nouvel utilisateur
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json("Signup successful");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Validation des champs requis
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Trouver l'utilisateur par e-mail
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Vérifier le mot de passe
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Ajouter une expiration au token pour plus de sécurité
    );

    // Réponse avec le token
    const { password: pass, ...userData } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(userData);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    // Trouver l'utilisateur par e-mail
    let user = await User.findOne({ email });

    if (user) {
      // Générer un token JWT pour l'utilisateur existant
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Ajouter une expiration au token pour plus de sécurité
      );
      const { password, ...userData } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(userData);
    } else {
      // Créer un nouvel utilisateur pour les connexions Google
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      user = new User({
        username: name.toLowerCase().replace(/\s+/g, '') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await user.save();

      // Générer un token JWT pour le nouvel utilisateur
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Ajouter une expiration au token pour plus de sécurité
      );
      const { password: pass, ...userData } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(userData);
    }
  } catch (error) {
    next(error);
  }
};
