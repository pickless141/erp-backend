const Tienda = require('../../models/tienda/Tienda'); 
const Cliente = require('../../models/cliente/Cliente.js'); 
const Producto = require('../../models/producto/Producto')

// Controlador para crear una tienda y asignarle un cliente con productos y precios
const crearTienda = async (req, res) => {
  try {
    const { nombreCliente, nombreTienda, direccion, descripcion, productos } = req.body;

    let clienteExistente = await Cliente.findOne({ nombre: nombreCliente });

    if (!clienteExistente) {
      clienteExistente = new Cliente({
        nombre: nombreCliente,
      });
      await clienteExistente.save();
    }

    
    const nuevaTienda = new Tienda({
      cliente: clienteExistente._id,
      nombreCliente: nombreCliente,
      nombreTienda,
      direccion,
      descripcion,
      productos, 
    });

    await nuevaTienda.save();

    res.status(201).json({ mensaje: 'Tienda creada exitosamente', tienda: nuevaTienda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear una tienda' });
  }
};

// Controlador para traer todas las tiendas con paginación y búsqueda opcional
const obtenerTodasLasTiendas = async (req, res) => {
  try {
    const { page = 1, search = '' } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    const filtro = search
      ? { $or: [{ nombreTienda: { $regex: search, $options: 'i' } }] }
      : {};

    let tiendas;
    let totalDocs;

    if (page && limit) {
      tiendas = await Tienda.find(filtro).skip(skip).limit(limit);
      totalDocs = await Tienda.countDocuments(filtro);
    } else {
      tiendas = await Tienda.find(filtro);
      totalDocs = tiendas.length;
    }

    res.status(200).json({ docs: tiendas, totalDocs, limit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener todas las tiendas' });
  }
};

// Controlador para obtener una tienda por su ID
const obtenerTienda = async (req, res) => {
  const tiendaId = req.params.id;
  try {
    const tienda = await Tienda.findById(tiendaId).populate('productos.producto');
    if (!tienda) {
      return res.status(404).json({ mensaje: 'No se encontró la tienda.' });
    }

    const productosConNombres = tienda.productos.map(prod => ({
      id: prod.producto._id, 
      nombre: prod.producto.nombreProducto,
      precio: prod.precio,
    }));

    res.status(200).json({
      ...tienda.toObject(),
      productos: productosConNombres
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la tienda' });
  } 
};

// Controlador para añadir productos a una tienda
const añadirProductos = async (req, res) => {
  const { tiendaId, productos } = req.body;

  try {
    const tienda = await Tienda.findById(tiendaId);
    if (!tienda) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    for (let { productoId, precio } of productos) {
      const producto = await Producto.findById(productoId);
      if (!producto) {
        return res.status(404).json({ error: `Producto no encontrado: ${productoId}` });
      }

      tienda.productos.push({ producto: productoId, precio });
    }

    await tienda.save();
    res.status(200).json({ mensaje: 'Productos añadidos con éxito', tienda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al añadir productos a la tienda' });
  }
};

// Controlador para traer todas las tiendas de un cliente
const obtenerTiendasPorCliente = async (req, res) => {
  const clienteId = req.params.clienteId;
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const skip = (page - 1) * limit; 

  try {
    const totalDocs = await Tienda.countDocuments({ cliente: clienteId });

    const tiendas = await Tienda.find({ cliente: clienteId })
      .skip(skip)
      .limit(limit);

    if (tiendas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron tiendas para este cliente.' });
    }

    res.status(200).json({
      docs: tiendas,
      totalDocs,
      limit
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al buscar tiendas por cliente.' });
  }
};

//Controlador para obtener detalles de una tienda
const tiendaDetalle = async (req, res) => {
  const tiendaId = req.params.id;

  try {
    const tienda = await Tienda.findById(tiendaId).populate({
      path: 'productos.producto', 
      select: '_id nombreProducto'  
    });

    if (!tienda) {
      return res.status(404).json({ mensaje: 'No se encontró la tienda.' });
    }

    const { nombreCliente, nombreTienda, direccion, descripcion, productos } = tienda;

    if (productos && productos.length > 0) {
      const productosConInfo = productos.map(prod => ({
        _id: prod.producto._id,  
        nombre: prod.producto.nombreProducto,
        precio: prod.precio  
      }));

      res.status(200).json({ nombreCliente, nombreTienda, direccion, descripcion, productos: productosConInfo });
    } else {
      res.status(200).json({ nombreTienda, direccion, descripcion, mensaje: 'No tiene productos registrados' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los detalles de la tienda' });
  }
};

// Controlador para obtener todas las tiendas sin límites ni paginación
const tiendaSelect = async (req, res) => {
  try {
    const tiendas = await Tienda.find()
      .populate({
        path: 'productos.producto',
        select: 'nombreProducto precio'  
      });
    res.status(200).json(tiendas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener todas las tiendas' });
  }
}

//Controlador para actualizar tiendas
const actualizarTienda = async (req, res) => {
  const { id } = req.params;
  const { productosAEliminar = [], productos: productosActualizados = [], ...datosActualizados } = req.body;

  try {
    const tienda = await Tienda.findById(id);

    if (!tienda) {
      return res.status(404).json({ error: 'La tienda no existe' });
    }

    Object.assign(tienda, datosActualizados);

    if (productosAEliminar.length > 0) {
      tienda.productos = tienda.productos.filter(({ producto }) => 
        !productosAEliminar.includes(producto.toString())
      );
    }

    productosActualizados.forEach(({ id, precio }) => {
      const productoIndex = tienda.productos.findIndex(({ producto }) => producto.toString() === id);
      if (productoIndex > -1) {
        tienda.productos[productoIndex].precio = precio;
      }
    });

    await tienda.save();
    const tiendaActualizada = await Tienda.findById(id).populate('productos.producto');

    res.status(200).json(tiendaActualizada);
  } catch (error) {
    console.error('Error al actualizar la tienda:', error);
    res.status(500).json({ error: 'Error al actualizar la tienda', detalles: error.message });
  }
};

// Controlador para eliminar una tienda
const eliminarTienda = async (req, res) => {
  const { id } = req.params;

  try {
    const tiendaEliminada = await Tienda.findOneAndDelete({ _id: id });

    if (!tiendaEliminada) {
      return res.status(404).json({ mensaje: 'No se encontró la tienda con el ID proporcionado.' });
    }

    res.status(200).json({ mensaje: 'Tienda eliminada con éxito.', tienda: tiendaEliminada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la tienda' });
  }
};


module.exports = { crearTienda, obtenerTodasLasTiendas, obtenerTienda, añadirProductos, obtenerTiendasPorCliente, tiendaDetalle, tiendaSelect, actualizarTienda, eliminarTienda };