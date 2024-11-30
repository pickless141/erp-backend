const filtroRol = (req, res, next) => {
    const { user } = req;

    if (!user) {
        return res.status(401).json({ message: 'No autenticado. Por favor, inicie sesión.' });
    }

    const accesoCompleto = ['admin', 'vendedor', 'tercerizado'];

    if (accesoCompleto.some((rol) => user.roles.includes(rol))) {
        return next();
    }

    if (user.roles.includes('repositor')) {
        req.query.usuario = user.id;
        return next();
    }

    return res.status(403).json({ message: 'Acceso no autorizado para este rol' });
};

module.exports = filtroRol;