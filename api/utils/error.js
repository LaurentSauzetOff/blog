// Assurez-vous d'avoir cette variable d'environnement définie
const isDevelopment = process.env.NODE_ENV === 'development';

export const errorHandler = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  // Ajout de la stack trace pour le développement
  if (isDevelopment) {
    error.stack = new Error().stack;
  }

  return error;
};
