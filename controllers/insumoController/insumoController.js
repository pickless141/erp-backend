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
const obtenerInsumos = async (req, res) => {
    try {
      const insumos = await Insumo.find();
      res.status(200).json(insumos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener todos los insumos' });
    }
  };
const obtenerProductoPorId = async (req, res) => {
    const insumoId = req.params.id;
  
    try {
      const insumo = await Insumo.findById(insumoId);
  
      if (!insumo) {
        return res.status(404).json({ error: 'El insumo no existe' });
      }
  
      res.status(200).json(insumo);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el insumo' });
    }
  };
const actualizarProducto = async (req, res) => {
  const insumoId = req.params.id;  
  const { producto, peso, descripcion } = req.body;

    try {
      const productoExistente = await Insumo.findById(insumoId)
      
      
      if (!productoExistente) {
        return res.status(404).json({ error: 'El producto no existe' });
      }
  
      const insumo = await Insumo.findOneAndUpdate(
        { _id: insumoId },
        { producto, peso, descripcion },
        { new: true }
      );
  
      if (!insumo) {
        return res.status(404).json({ error: 'El insumo no existe' });
      }
  
      res.status(200).json({ mensaje: 'Insumo actualizado exitosamente', producto });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el insumo' });
    }
  };


  module.exports = {
    crearProducto,
    obtenerInsumos,
    obtenerProductoPorId,
    actualizarProducto
}