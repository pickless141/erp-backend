const Reposicion = require('../../models/reposicion/Reposicion.js');
const Producto = require('../../models/producto/Producto.js');
const Cliente = require('../../models/cliente/Cliente.js')

// Controlador para agregar una reposición de productos
const agregarReposicion = async (req, res) => {
    const { cantidadAnterior, fechaReposicion, cliente, productos } = req.body;
  
    try {
      // Verifica si el cliente existe
      const clienteExistente = await Cliente.findById(cliente);
      if (!clienteExistente) {
        return res.status(404).json({ error: 'El cliente no existe' });
      }
  
      // Verifica si los productos existen en el modelo de Producto y almacena los productos válidos
      const productosValidos = [];
      for (const productoInfo of productos) {
        const productoExistente = await Producto.findById(productoInfo.producto);
        if (productoExistente) {
          productosValidos.push({
            producto: productoInfo.producto,
            cantidad: productoInfo.cantidad,
          });
        }
      }
  
      // Crea una nueva reposición con los productos válidos
      const nuevaReposicion = new Reposicion({
        cantidadAnterior,
        fechaReposicion,
        cliente,
        productos: productosValidos, // Asigna la lista de productos válidos a la reposición
      });
  
      await nuevaReposicion.save();
  
      res.status(201).json({ message: 'Reposición añadida con éxito', nuevaReposicion });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al agregar una reposición de productos' });
    }
};

// Controlador para obtener todas las reposiciones
const obtenerTodasLasReposiciones = async (req, res) => {
    try {
      const reposiciones = await Reposicion.find().populate('cliente productos.producto cantidadAnterior.producto');
      
      if (reposiciones.length === 0) {
        return res.status(200).json({ message: 'No hay reposiciones registradas' });
      }
  
      res.status(200).json(reposiciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las reposiciones' });
    }
};

// Controlador para obtener una reposición por su ID
const obtenerReposicionPorId = async (req, res) => {
    const reposicionId = req.params.id; // El ID se tomará de los parámetros de la ruta
  
    try {
      const reposicion = await Reposicion.findById(reposicionId)
        .populate('productos.producto')
        .populate('cantidadAnterior.producto')
        .populate('cliente');
  
      if (!reposicion) {
        return res.status(404).json({ message: 'La reposición no existe' });
      }
  
      res.status(200).json(reposicion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener la reposición por ID' });
    }
};

module.exports = { agregarReposicion, obtenerTodasLasReposiciones, obtenerReposicionPorId };