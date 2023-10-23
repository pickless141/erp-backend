const Pedido = require('../../models/pedido/Pedido.js');
const Producto = require('../../models/producto/Producto.js');
const Tienda = require('../../models/tienda/Tienda.js')


const crearPedidoEnTienda = async (req, res) => {
  try {
    // Obten los datos del cuerpo de la solicitud
    const { tiendaId, productos } = req.body;

    // Verifica si la tienda existe
    const tienda = await Tienda.findById(tiendaId);
    if (!tienda) {
      return res.status(404).json({ error: 'La tienda no existe' });
    }

    // Inicializa el precio total en 0
    let precioTotal = 0;

    // Verifica la existencia de los productos y calcula el precio total
    for (const productoInfo of productos) {
      const { productoId, cantidad } = productoInfo;
      const producto = await Producto.findById(productoId);

      if (!producto) {
        return res.status(400).json({ error: `El producto con ID ${productoId} no existe` });
      }

      if (cantidad > producto.existencia) {
        return res.status(400).json({
          error: `No hay suficiente existencia del producto: ${producto.nombre}`,
        });
      }

      // Suma el precio del producto al precio total
      precioTotal += producto.precio * cantidad;

      // Resta la cantidad del producto a la existencia
      producto.existencia -= cantidad;

      // Guarda el producto actualizado en la base de datos
      await producto.save();
    }

    // Calcula la fecha actual
    const fechaPedido = new Date();

    // Crea el pedido
    const nuevoPedido = new Pedido({
      tienda: tiendaId,
      productos,
      precioTotal,
      fechaPedido,
    });

    // Guarda el pedido en la base de datos
    await nuevoPedido.save();

    res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedido: nuevoPedido });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear un nuevo pedido en la tienda' });
  }
}

// Controlador para obtener todos los pedidos
const obtenerTodosLosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('tienda productos.producto');

    res.status(200).json({ pedidos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};
  
module.exports = { crearPedidoEnTienda, obtenerTodosLosPedidos };