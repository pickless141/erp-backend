const Insumo = require('../../models/insumos/Insumo.js')

const crearProducto = async (req, res) => {
    const {producto, peso, descripcion} = req.body;

    try {
        const nuevoProducto = new Insumo({
            producto,
            peso,
            descripcion
        });

        await nuevoProducto.save();

        res.status(201).json({mensaje: 'Producto agregado exitosamente', insumo: nuevoProducto});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Error al crear el producto'})
    }
}

module.exports = {
    crearProducto
}