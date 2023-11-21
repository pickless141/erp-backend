const Insumo = require('../../models/insumos/Insumo.js')

const crearProducto = async (req, res) => {
    const {producto, peso, descripcion} = req.body;

    try {
        const nuevoProducto = new Insumo({
            producto,
            peso,
            descripcion
        });

        await nuevoProducto.save();

        res.status(201).json({mensaje: 'Producto agregado exitosamente', insumo: nuevoProducto});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Error al crear el producto'})
    }
}
//Controlador para obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
      const productos = await Insumo.find();
      res.status(200).json(productos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener todos los productos' });
    }
  };
const actualizarProducto = async (req, res) => {
    const { _id, peso, descripcion } = req.body;

    try {
      if (!_id || (!peso && !descripcion)) {
        return res.status(400).json({ error: 'Se requiere el ID del insumo y al menos una propiedad para actualizar.' });
      }

      const insumoExistente = await Insumo.findById(_id);
      if (!insumoExistente) {
        return res.status(404).json({ error: 'Insumo no encontrado.' });
      }

      const propiedadesPermitidas = ['peso', 'descripcion'];

      propiedadesPermitidas.forEach((propiedad) => {
        if (req.body[propiedad] !== undefined) {
          insumoExistente[propiedad] = req.body[propiedad];
        }
      });

      await insumoExistente.save();

      res.json({ mensaje: 'Insumo actualizado correctamente.' });
    } catch (error) {
      console.error('Error al actualizar el insumo:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };


  module.exports = {
    crearProducto,
    obtenerProductos,
    actualizarProducto
}