import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez entrer un email valide",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    socialLinks: {
      twitter: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      github: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

// Middleware pour hasher le mot de passe avant de le sauvegarder
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer le mot de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Création du modèle utilisateur
const User = mongoose.model("User", userSchema);

export default User;
