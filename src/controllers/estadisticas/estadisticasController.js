const mongoose = require('mongoose')
const Pedido = require('../../models/pedido/Pedido.js');
const Producto  = require('../../models/producto/Producto.js')
const Tienda = require('../../models/tienda/Tienda.js');
const Reposicion = require('../../models/reposicion/Reposicion');
const Usuarios = require('../../models/user/User.js');

// Controlador para obtener las tiendas con más pedidos completados y el total de ventas
const tiendasConMasPedidos = async (req, res) => {
  try {
    const resultado = await Pedido.aggregate([
      { $match: { estado: "COMPLETADO" } },
      {
        $group: {
          _id: "$tienda",
          totalPedidos: { $sum: 1 },
          totalVentas: { $sum: "$total" } 
        }
      },
      { $sort: { totalPedidos: -1 } }, 
      { $limit: 5 }
    ]);

    const tiendasConPedidos = await Tienda.populate(resultado, {
      path: "_id",
      select: "nombreTienda nombreCliente direccion"
    });

    res.status(200).json(tiendasConPedidos);
  } catch (error) {
    console.error('Error al obtener las tiendas con más pedidos completados:', error);
    res.status(500).json({ error: 'Error al obtener las tiendas con más pedidos completados' });
  }
};

// Controlador para obtener los usuarios con más reposiciones
const usuariosReposiciones = async (req, res) => {
  try {
    const resultado = await Reposicion.aggregate([
      {
        $group: {
          _id: "$usuario",
          totalReposiciones: { $sum: 1 }
        }
      },
      { $sort: { totalReposiciones: -1 } },
      { $limit: 5 }
    ]);

    const usuariosConReposiciones = await Usuarios.populate(resultado, {
      path: "_id",
      select: "nombre apellido email"
    });

    res.status(200).json(usuariosConReposiciones);
  } catch (error) {
    console.error('Error al obtener los usuarios con más reposiciones:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios con más reposiciones' });
  }
};

// Controlador para obtener los productos más vendidos
const productosMasVendidos = async (req, res) => {
  try {
    const resultado = await Pedido.aggregate([
      { $match: { estado: "COMPLETADO" } },
      { $unwind: "$pedido" },
      {
        $group: {
          _id: "$pedido.producto",
          totalVendidos: { $sum: "$pedido.cantidad" }
        }
      },
      { $sort: { totalVendidos: -1 } },
      { $limit: 5 }
    ]);

    const productosConDetalles = await Producto.populate(resultado, {
      path: "_id",
      select: "nombreProducto lote codBarra categoria"
    });

    res.status(200).json(productosConDetalles);
  } catch (error) {
    console.error('Error al obtener los productos más vendidos:', error);
    res.status(500).json({ error: 'Error al obtener los productos más vendidos' });
  }
};

const productosMasVendidosPorTienda = async (req, res) => {
  try {
    const { tiendaId } = req.params;

    const resultado = await Pedido.aggregate([
      { $match: { estado: "COMPLETADO", tienda: new mongoose.Types.ObjectId(tiendaId) } },
      { $unwind: "$pedido" },
      {
        $group: {
          _id: "$pedido.producto",
          totalVendidos: { $sum: "$pedido.cantidad" }
        }
      },
      { $sort: { totalVendidos: -1 } },
      { $limit: 5 }
    ]);

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: 'La tienda aún no tiene pedidos completados.' });
    }

    const productosConDetalles = await Producto.populate(resultado, {
      path: "_id",
      select: "nombreProducto lote codBarra categoria"
    });

    res.status(200).json(productosConDetalles);
  } catch (error) {
    console.error('Error al obtener los productos más vendidos por tienda:', error);
    res.status(500).json({ error: 'Error al obtener los productos más vendidos por tienda' });
  }
};

const ventasMensuales = async (req, res) => {
  try {
    let { year, month } = req.query;

    year = year ? parseInt(year, 10) : null;
    month = month ? parseInt(month, 10) : null;

    const match = { estado: "COMPLETADO" };

    if (year && month) {
      const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));
      match.fechaPedido = { $gte: start, $lt: end };
    } else if (year && !month) {
      const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
      const end = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0));
      match.fechaPedido = { $gte: start, $lt: end };
    }

    const pipeline = [
      { $match: match },

      {
        $addFields: {
          totalCalc: {
            $ifNull: [
              "$total",
              {
                $sum: {
                  $map: {
                    input: "$pedido",
                    as: "p",
                    in: { $multiply: ["$$p.cantidad", "$$p.precio"] },
                  },
                },
              },
            ],
          },
        },
      },

      {
        $group: {
          _id: {
            year: { $year: "$fechaPedido" },
            month: { $month: "$fechaPedido" },
          },
          totalVendido: { $sum: "$totalCalc" },
          pedidosCompletados: { $sum: 1 },
        },
      },

      { $sort: { "_id.year": 1, "_id.month": 1 } },

      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalVendido: 1,
          pedidosCompletados: 1,
        },
      },
    ];

    const resultados = await Pedido.aggregate(pipeline);

    return res.status(200).json({
      filtros: { year, month, estado: "COMPLETADO" },
      resultados,
    });
  } catch (error) {
    console.error("Error en ventasMensuales:", error);
    return res.status(500).json({ error: "Error al obtener ventas mensuales" });
  }
};

module.exports = { tiendasConMasPedidos, usuariosReposiciones, productosMasVendidos, productosMasVendidosPorTienda, ventasMensuales };