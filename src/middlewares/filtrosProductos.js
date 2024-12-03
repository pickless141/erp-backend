const Producto = require('../models/producto/Producto');

const filtrarProductosCategoria = async (req, res, next) => {
  const usuarioEmpresa = req.user.empresa;  

  try {
    if (usuarioEmpresa === 'EatWell') {
      req.filtrarProductos = await Producto.find({ categoria: 'EatWell' });  
    } else if (usuarioEmpresa === 'Lievito') {
      req.filtrarProductos = await Producto.find(); 
    }

    next();  
  } catch (error) {
    console.error('Error al filtrar los productos', error);
    return res.status(500).json({ mensaje: 'Error al filtrar los productos por empresa' });
  }
};

module.exports = filtrarProductosCategoria;