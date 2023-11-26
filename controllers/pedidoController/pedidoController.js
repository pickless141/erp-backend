const Pedido = require('../../models/pedido/Pedido.js');
const Producto = require('../../models/producto/Producto.js');
const Tienda = require('../../models/tienda/Tienda.js')


const nuevoPedido = async (req, res) => {
  const { tienda, pedido } = req.body;

  try {
    const tiendaEncontrada = await Tienda.findById(tienda);

    if (!tiendaEncontrada) {
      return res.status(400).json({ error: 'Esa tienda no existe' });
    }

    let total = 0; 

    const pedidoConInfoProducto = []; 

    for (const articulo of pedido) {
      const { id, cantidad } = articulo;

      const producto = await Producto.findById(id);

      if (cantidad > producto.existencia) {
        return res.status(400).json({ error: `El artículo: ${producto.nombre} excede la cantidad disponible` });
      } else {
        await producto.save();

        total += producto.precio * cantidad;

        pedidoConInfoProducto.push({ producto, cantidad });
      }
    }

    const nuevoPedido = new Pedido({ tienda: tiendaEncontrada._id, pedido: pedidoConInfoProducto, total });

    const resultado = await nuevoPedido.save();
    return res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedido: resultado });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear un nuevo pedido' });
  }
};

const obtenerTodosLosPedidos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 3;

  try {
    const totalPedidos = await Pedido.countDocuments();
    const pedidos = await Pedido.find()
      .sort({fechaPedido: -1})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('tienda');

    res.status(200).json({ pedidos, totalPedidos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};


//Actualizar el estado del pedido para restar la existencia una vez que se complete el pedido
const cambiarEstadoPedido = async (req, res) => {
  const { pedidoId, nuevoEstado } = req.body;

  try {
    const pedido = await Pedido.findById(pedidoId);

    if (!pedido) {
      return res.status(400).json({ error: 'Pedido no encontrado' });
    }

    if (nuevoEstado === 'COMPLETADO' && pedido.estado !== 'COMPLETADO') {
      for (const articulo of pedido.pedido) {
        const { producto, cantidad } = articulo;
        const productoActualizado = await Producto.findByIdAndUpdate(
          producto,
          { $inc: { existencia: -cantidad } }
        );
      }
    }

    // Actualiza el estado del pedido
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