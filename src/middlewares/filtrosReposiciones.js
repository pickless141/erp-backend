const Reposicion = require('../models/reposicion/Reposicion');

const filtrarReposiciones = async (req, res, next) => {
  const usuarioEmpresa = req.empresa;
  const { page = 1, limit = 5, categoria } = req.query; // Ahora también se toma la categoría como query param
  const tiendaId = req.params.tiendaId;

  try {
    let query = tiendaId ? { tienda: tiendaId } : {};

    if (usuarioEmpresa === 'EatWell') {
      query['productos.producto'] = { $exists: true };
    }

    const allReposiciones = await Reposicion.find(query)
      .sort({ fechaReposicion: -1 })
      .populate({
        path: 'productos.producto',
        match: {
          ...(categoria ? { categoria } : {}), // Agregar el filtro de categoría si está definido
          ...(usuarioEmpresa === 'EatWell' ? { categoria: 'EatWell' } : {}),
        },
        select: 'nombreProducto categoria',
      })
      .populate('tienda', 'nombreTienda')
      .populate('usuario', 'nombre apellido email');

    const filteredReposiciones = allReposiciones.filter((reposicion) =>
      usuarioEmpresa === 'EatWell'
        ? reposicion.productos.some(
            (producto) => producto.producto && producto.producto.categoria === 'EatWell'
          )
        : true
    );

    if (tiendaId) {
      req.reposicionesFiltradas = filteredReposiciones.slice(0, 2); // Últimas 2 reposiciones
    } else {
      req.reposicionesFiltradas = filteredReposiciones.slice((page - 1) * limit, page * limit);
    }

    req.totalDocs = filteredReposiciones.length;

    next();
  } catch (error) {
    console.error('Error al filtrar las reposiciones por empresa:', error);
    res.status(500).json({ mensaje: 'Error al filtrar las reposiciones por empresa.' });
  }
};

module.exports = filtrarReposiciones;