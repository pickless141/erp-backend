const Pedido = require('../../models/pedido/Pedido.js')
const Producto = require('../../models/producto/Producto.js')
const Tienda = require('../../models/tienda/Tienda.js')


const nuevoPedido = async (req, res) => {
  const { tiendaId, productos, descripcion } = req.body; 
  const usuarioId = req.usuarioId; 
  
  try {
    const tiendaEncontrada = await Tienda.findById(tiendaId).populate('productos.producto');
    if (!tiendaEncontrada) {
      return res.status(400).json({ error: 'Esa tienda no existe' });
    }
    
    let total = 0;
    let IVA = 0;
    const pedidoConInfoProducto = [];

    for (const articulo of productos) {  
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
      usuario: usuarioId,
      tienda: tiendaEncontrada._id,
      pedido: pedidoConInfoProducto,
      descripcion,
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

const pedidoVendedor = async (req, res) => {
  const { tiendaId, descripcion, fechaEntrega } = req.body;
  const usuarioId = req.usuarioId;
  try {
    const tienda = await Tienda.findById(tiendaId).populate('productos.producto');
    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    let total = 0;
    const pedidoProductos = [];
    for (const { productoId, cantidad } of req.body.productos) {
      const productoEnTienda = tienda.productos.find(p => p.producto._id.toString() === productoId);
      if (!productoEnTienda) {
        return res.status(400).json({ error: `Producto con ID ${productoId} no disponible en la tienda seleccionada` });
      }
      const subtotal = productoEnTienda.precio * cantidad;
      total += subtotal;

      pedidoProductos.push({
        producto: productoEnTienda.producto._id,
        cantidad,
        precio: productoEnTienda.precio,
      });
    }

    const IVA = Math.floor(total / 11); 

    const nuevoPedido = new Pedido({
      usuario: usuarioId,
      tienda: tienda._id,
      pedido: pedidoProductos,
      total,
      descripcion,
      IVA,
      estado: 'PENDIENTE',
      fechaEntrega: fechaEntrega || null,
    });

    const resultadoPedido = await nuevoPedido.save();
    return res.status(201).json({
      mensaje: 'Pedido registrado exitosamente',
      pedido: resultadoPedido
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al registrar el pedido: ' + error.message });
  }
}

const obtenerTodosLosPedidos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 3;

    const totalDocs = await Pedido.countDocuments();
    const docs = await Pedido.find()
      .sort({ fechaPedido: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: 'tienda',
        select: 'nombreCliente nombreTienda',
      })
      .populate('usuario', 'nombre apellido')
      .select('estado descripcion usuario total IVA tienda fechaEntrega');

    const response = {
      docs,
      totalDocs,
      limit: perPage,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};

const obtenerPedidoPorId = async (req, res) => {
  const { pedidoId } = req.params;

  try {
    const pedido = await Pedido.findById(pedidoId)
      .populate('pedido.producto', 'nombreProducto')
      .populate('tienda', 'nombreCliente nombreTienda direccion')
      .populate('usuario', 'nombre apellido');

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.status(200).json({ pedido });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el pedido: ' + error.message });
  }
};

const pedidosTienda = async (req, res) => {
  const { tiendaId } = req.params;  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalDocs = await Pedido.countDocuments({ tienda: tiendaId });

    const docs = await Pedido.find({ tienda: tiendaId })
      .sort({ fechaPedido: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'tienda',
        populate: {
          path: 'productos.producto'
        }
      })
      .populate('pedido.producto')
      .populate('usuario', 'nombre apellido'); 

    if (docs.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron pedidos para esta tienda.' });
    }

    const response = {
      docs,
      totalDocs,
      limit
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos de la tienda' });
  }
};

const pedidoResumen = async (req, res) => {
  const pedidoId = req.params.id;  

  try {
    const pedido = await Pedido.findById(pedidoId)
      .populate({
        path: 'pedido.producto', 
        select: 'nombreProducto existencia'  
      })
      .populate({
        path: 'tienda',
        select: 'nombreTienda'
      });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const productosConInfo = pedido.pedido.map(item => ({
      producto: item.producto.nombreProducto,  
      cantidad: item.cantidad,
      _id: item._id
    }));

    res.status(200).json({ 
      pedidos: productosConInfo,
      tienda: { nombre: pedido.tienda.nombreTienda }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar el resumen del pedido' });
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

const editarPedido = async (req, res) => {
  const { pedidoId } = req.params;
  const { descripcion, productos, fechaEntrega } = req.body;

  try {
    const pedido = await Pedido.findById(pedidoId).populate('pedido.producto');
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    pedido.descripcion = descripcion || '';

    let total = 0;
    const nuevoPedido = [];

    for (const articulo of productos) {
      const { productoId, cantidad } = articulo;

      const tienda = await Tienda.findById(pedido.tienda).populate('productos.producto');
      const productoEnTienda = tienda.productos.find(p => p.producto._id.toString() === productoId);
      if (!productoEnTienda) {
        return res.status(404).json({ error: `Producto con ID ${productoId} no encontrado en la tienda` });
      }

      const precio = productoEnTienda.precio;
      const subtotal = precio * cantidad;
      total += subtotal;

      nuevoPedido.push({
        producto: productoEnTienda.producto._id,
        cantidad,
        precio,
      });
    }

    pedido.pedido = nuevoPedido;
    pedido.total = total;
    pedido.IVA = Math.floor(total / 11) || 0;

    if (fechaEntrega !== undefined) {
      pedido.fechaEntrega = fechaEntrega === '' ? null : fechaEntrega;
    }

    const pedidoActualizado = await pedido.save();

    return res.status(200).json({
      mensaje: 'Pedido actualizado exitosamente',
      pedido: pedidoActualizado
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el pedido: ' + error.message });
  }
};

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
  
module.exports = { nuevoPedido, pedidoVendedor,obtenerTodosLosPedidos, obtenerPedidoPorId, pedidoResumen, pedidosTienda, cambiarEstadoPedido, editarPedido, eliminarPedido };