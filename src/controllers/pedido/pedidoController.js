const Pedido = require('../../models/pedido/Pedido.js');
const Producto = require('../../models/producto/Producto.js');
const Tienda = require('../../models/tienda/Tienda.js')


const nuevoPedido = async (req, res) => {
  const { tiendaId, pedido } = req.body;
  console.log(req.body);

  try {
    const tiendaEncontrada = await Tienda.findById(tiendaId).populate('productos.producto');
    if (!tiendaEncontrada) {
      return res.status(400).json({ error: 'Esa tienda no existe' });
    }

    let total = 0;
    let IVA = 0;
    const pedidoConInfoProducto = [];

    for (const articulo of pedido) {
      const { productoId, cantidad } = articulo;

      const productoEnTienda = tiendaEncontrada.productos.find(p => p.producto._id.toString() === productoId);

      if (!productoEnTienda) {
        throw new Error(`El producto con ID ${productoId} no se encuentra en la tienda`);
      }

      const subtotal = productoEnTienda.precio * cantidad;
      total += subtotal;

      pedidoConInfoProducto.push({
        producto: productoEnTienda.producto._id,
        cantidad,
        precio: productoEnTienda.precio,
      });
    }

    IVA = Math.floor(total / 11);
    const nuevoPedido = new Pedido({
      tienda: tiendaEncontrada._id,
      pedido: pedidoConInfoProducto,
      total,
      IVA,
    });

    const resultado = await nuevoPedido.save();
    return res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedido: resultado });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const obtenerTodosLosPedidos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 3;

  try {
    const totalPedidos = await Pedido.countDocuments();
    const pedidos = await Pedido.find()
      .sort({ fechaPedido: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: 'tienda',
        populate: { 
          path: 'productos.producto', 
        },
      })
      .populate({
        path: 'pedido.producto', 
      });

    res.status(200).json({ pedidos, totalPedidos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};


const cambiarEstadoPedido = async (req, res) => {
  const { pedidoId } = req.params;
  const { nuevoEstado } = req.body;

  try {
    const pedido = await Pedido.findById(pedidoId).populate('pedido.producto');

    if (!pedido) {
      return res.status(400).json({ error: 'Pedido no encontrado' });
    }

    if (nuevoEstado === 'COMPLETADO' && pedido.estado !== 'COMPLETADO') {
      for (const articulo of pedido.pedido) {
        const { producto, cantidad } = articulo;

        if (producto.existencia < cantidad) {
          return res.status(400).json({ error: `No hay suficiente existencia del producto ${producto.nombreProducto}. Existencia actual: ${producto.existencia}` });
        }
      }

      for (const articulo of pedido.pedido) {
        const { producto, cantidad } = articulo;
        await Producto.findByIdAndUpdate(
          producto._id,
          { $inc: { existencia: -cantidad } }
        );
      }
    }

    pedido.estado = nuevoEstado;
    await pedido.save();

    return res.status(200).json({ mensaje: 'Estado del pedido actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al cambiar el estado del pedido' });
  }
};

// Controlador para eliminar un pedido
const eliminarPedido = async (req, res) => {
  const { pedidoId } = req.params;

  try {
    const pedidoEliminado = await Pedido.findOneAndDelete({ _id: pedidoId });

    if (!pedidoEliminado) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    return res.status(200).json({ mensaje: 'Pedido eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar el pedido' });
  }
};
  
module.exports = { nuevoPedido, obtenerTodosLosPedidos, cambiarEstadoPedido, eliminarPedido };