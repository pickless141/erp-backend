const Pedido = require('../../models/pedido/Pedido.js');
const Producto = require('../../models/producto/Producto.js');
const Cliente = require('../../models/cliente/Cliente.js')

// Controlador para crear un nuevo pedido
const crearPedido = async (req, res) => {
    const { cliente, pedido } = req.body;
  
    try {
      // Verificar si el cliente existe
      const clienteExiste = await Cliente.findById(cliente);
  
      if (!clienteExiste) {
        return res.status(404).json({ error: 'Ese cliente no existe' });
      }
  
      // Verificar que el stock esté disponible
      const promesasProductos = pedido.map(async (articulo) => {
        const { id, cantidad } = articulo;
        const producto = await Producto.findById(id);
        if (cantidad > producto.existencia) {
          throw new Error(`El artículo: ${producto.nombre} excede la cantidad disponible`);
        }
        return producto;
      });

      const productos = await Promise.all(promesasProductos);

      // Calcular el total del pedido
      const total = productos.reduce((acc, producto, index) => {
        const { precio } = producto;
        const cantidad = pedido[index].cantidad;
        return acc + precio * cantidad;
      }, 0);
  
      // Restar la cantidad al stock disponible
      const restarExistencia = productos.map(async (producto, index) => {
        const cantidad = pedido[index].cantidad;
        producto.existencia -= cantidad;
        await producto.save();
      });

      await Promise.all(restarExistencia);
  
      // Crear un nuevo pedido
      const nuevoPedido = new Pedido({
        cliente,
        pedido,
        total,
      });
  
      // Guardar el pedido en la base de datos
      await nuevoPedido.save();
  
      res.status(201).json({ message: 'Pedido creado con éxito', nuevoPedido });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al crear un pedido' });
    }
};

const obtenerTodosLosPedidos = async (req, res) => {
    try {
      const pedidos = await Pedido.find().populate('cliente').populate('pedido.producto');
  
      if (pedidos.length === 0) {
        return res.status(200).json({ message: 'Aún no hay pedidos' });
      }
  
      res.status(200).json(pedidos);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
};
  
module.exports = { crearPedido, obtenerTodosLosPedidos };