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

      // Configurar `req.user` con toda la información del token
      req.user = {
        id: decoded.userId,
        roles: decoded.roles,
        empresa: decoded.empresa,
        nombre: decoded.nombre,
        apellido: decoded.apellido,
      };

      // Verificar si el rol del usuario está permitido
      if (!allowedRoles.some(role => decoded.roles.includes(role))) {
        return res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: 'Token inválido.' });
      console.error(error);
    }
  };
};

module.exports = checkRole;