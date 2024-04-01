const Insumo = require('../../models/insumos/Insumo.js');

const crearInsumo = async (req, res) => {
  const { producto, peso, descripcion } = req.body;

  try {
    const nuevoInsumo = new Insumo({
      producto,
      peso,
      descripcion,
    });

    await nuevoInsumo.save();

    res.status(201).json({ mensaje: 'Insumo agregado exitosamente', insumo: nuevoInsumo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear el insumo' });
  }
};

const obtenerInsumos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const search = req.query.search || '';

    const filter = {
      producto: { $regex: search, $options: 'i' },
    };

    const totalInsumos = await Insumo.countDocuments(filter);
    const insumos = await Insumo.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage);

    const response = { docs: insumos, totalDocs: totalInsumos, limit: perPage };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los insumos' });
  }
};

const obtenerInsumoPorId = async (req, res) => {
  const insumoId = req.params.id;

  try {
    const insumo = await Insumo.findById(insumoId);

    if (!insumo) {
      return res.status(404).json({ error: 'El insumo no existe' });
    }

    res.status(200).json(insumo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el insumo' });
  }
};

const actualizarInsumo = async (req, res) => {
  const insumoId = req.params.id;
  const { producto, peso, descripcion } = req.body;

  try {
    const insumoExistente = await Insumo.findById(insumoId);

    if (!insumoExistente) {
      return res.status(404).json({ error: 'El insumo no existe' });
    }

    insumoExistente.producto = producto;
    insumoExistente.peso = peso;
    insumoExistente.descripcion = descripcion;

    await insumoExistente.save();

    res.status(200).json({ mensaje: 'Insumo actualizado exitosamente', insumo: insumoExistente });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el insumo' });
  }
};

const eliminarInsumo = async (req, res) => {
  const { id } = req.params;
  try {
    const insumoEliminado = await Insumo.findOneAndDelete({ _id: id });

    if (!insumoEliminado) {
      return res.status(404).json({ mensaje: 'No se encontró el insumo con el ID proporcionado.' });
    }

    res.status(200).json({ mensaje: 'Insumo eliminado con éxito.', insumo: insumoEliminado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el insumo' });
  }
}

module.exports = {
  crearInsumo,
  obtenerInsumos,
  obtenerInsumoPorId,
  actualizarInsumo,
  eliminarInsumo
};