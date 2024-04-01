const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwtSecret

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.usuarioId = decoded.userId;

      if (!allowedRoles.some(role => decoded.roles.includes(role))) {
        return res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: 'Token inválido.' });
      console.log(error)
    }
  };
};

module.exports = checkRole;