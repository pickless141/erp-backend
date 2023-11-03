const Pedido = require('../../models/pedido/Pedido.js');
const Producto = require('../../models/producto/Producto.js');
const Tienda = require('../../models/tienda/Tienda.js')


const nuevoPedido = async (req, res) => {
  const { tienda, pedido } = req.body;

  try {
    const tiendaEncontrada = await Tienda.findOne({ nombreTienda: tienda });

    if (!tiendaEncontrada) {
      return res.status(400).json({ error: 'Esa tienda no existe' });
    }

    let total = 0; 

    const pedidoConInfoProducto = []; 

    // Verificar el stock para cada producto en el pedido y calcular el total
    for (const articulo of pedido) {
      const { id, cantidad } = articulo;

      const producto = await Producto.findById(id);

      if (cantidad > producto.existencia) {
        return res.status(400).json({ error: `El artículo: ${producto.nombre} excede la cantidad disponible` });
      } else {
        await producto.save();

        // Calcula el costo de este artículo y agrégalo al total
        total += producto.precio * cantidad;

        pedidoConInfoProducto.push({ producto, cantidad });
      }
    }

    // Crear un nuevo pedido utilizando el ID de la tienda encontrada
    const nuevoPedido = new Pedido({ tienda: tiendaEncontrada._id, pedido: pedidoConInfoProducto, total });

    // Guardar el pedido en la base de datos
    const resultado = await nuevoPedido.save();
    return res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedido: resultado });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear un nuevo pedido' });
  }
};

// Controlador para obtener todos los pedidos
const obtenerTodosLosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('tienda'); 

    res.status(200).json({ pedidos });
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

    // Verifica si el nuevo estado es diferente al estado actual
    if (nuevoEstado === 'COMPLETADO' && pedido.estado !== 'COMPLETADO') {
      // Aquí puedes implementar la lógica para restar existencia en productos
      for (const articulo of pedido.pedido) {
        const { producto, cantidad } = articulo;
        // Realiza la resta de existencia en el modelo de Producto
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
  
module.exports = { nuevoPedido, obtenerTodosLosPedidos, cambiarEstadoPedido };