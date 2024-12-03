const Facturacion = require('../../models/facturacion/Facturacion');
const Tienda = require('../../models/tienda/Tienda');
const Cliente = require('../../models/cliente/Cliente');

const crearFactura = async (req, res) => {
  try {
    const { clienteId, tiendaId, productosSeleccionados, fechaFactura, fechaVencimiento, metodoPago } = req.body;

    const cliente = await Cliente.findById(clienteId);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

    const tienda = await Tienda.findById(tiendaId).populate('productos.producto');
    if (!tienda) return res.status(404).json({ message: 'Tienda no encontrada' });

    
    let total = 0;
    const productos = productosSeleccionados.map((item) => {
      const producto = tienda.productos.find((p) => p.producto._id.toString() === item.productoId);
      if (!producto) throw new Error(`Producto con ID ${item.productoId} no encontrado en esta tienda`);
      const subTotal = producto.precio * item.cantidad;
      total += subTotal;
      return {
        producto: producto.producto._id,
        cantidad: item.cantidad,
      };
    });

    const iva = total / 11;

    const nuevaFactura = new Facturacion({
      cliente: clienteId,
      tienda: tiendaId,
      productos,
      total,
      IVA: iva,
      fechaFactura,
      fechaVencimiento,
      metodoPago,
      estado: 'PENDIENTE',
    });

    await nuevaFactura.save();
    res.status(201).json(nuevaFactura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la factura', error: error.message });
  }
};

const obtenerFacturas = async (req, res) => {
    try {
      const facturas = await Facturacion.find()
        .populate({
          path: 'cliente',
          select: 'nombre ruc', 
        })
        .populate({
          path: 'tienda',
          select: 'nombreTienda', 
        })
        .populate({
          path: 'productos.producto',
          select: 'nombreProducto', 
        });
  
      res.status(200).json(facturas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener las facturas', error: error.message });
    }
};

const eliminarFactura = async (req, res) => {
  const {facturaId} = req.params
  try {
    const facturaEliminada = await Facturacion.findOneAndDelete({_id: facturaId})

   if(!facturaEliminada) {
    return res.status(404).json({error: "Factura no encontrada"})
   }

   return res.status(200).json({mensaje: "Factura eliminada correctamente"})

  } catch (error) {
    console.error(error)
    return res.status(500).json({error: "Error al eliminar una factura"})
  }
}

module.exports = { crearFactura, obtenerFacturas, eliminarFactura };