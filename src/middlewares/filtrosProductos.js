const Producto = require('../models/producto/Producto');
const Categoria = require('../models/categoria/Categoria'); 

const filtrarProductosCategoria = async (req, res, next) => {
  const usuarioEmpresa = req.user.empresa;  

  try {
    if (usuarioEmpresa === 'EatWell') {
      const categoriaEatWell = await Categoria.findOne({ nombre: 'EatWell' }).select('_id');

      if (!categoriaEatWell) {
        req.filtrarProductos = [];
        return next();
      }

      req.filtrarProductos = await Producto.find({ categoria: categoriaEatWell._id });  
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