const cron = require('node-cron');
const Facturacion = require('../models/facturacion/Facturacion');

function initializeCronJobs(io) {
  cron.schedule('0 0 * * *', async () => {
    try {
      const facturasVencidas = await Facturacion.find({
        fechaVencimiento: { $lte: new Date() },
        estado: { $in: ['PENDIENTE', 'VENCIDO'] },
      }).populate('cliente tienda productos.producto'); 

      if (facturasVencidas.length > 0) {
        await Facturacion.updateMany(
          { _id: { $in: facturasVencidas.filter(factura => factura.estado === 'PENDIENTE').map(factura => factura._id) } },
          { $set: { estado: 'VENCIDO' } }
        );

        io.emit('facturasVencidas', facturasVencidas);
        console.log(`Notificación enviada: ${facturasVencidas.length} facturas vencidas`);
      } else {
        console.log("No hay facturas vencidas en este momento.");
      }
    } catch (error) {
      console.error('Error al procesar facturas vencidas:', error);
    }
  });
}

module.exports = initializeCronJobs;