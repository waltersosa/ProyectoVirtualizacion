import express from 'express';
import { deviceController } from '../controllers/deviceController';
import { proxyController } from '../controllers/proxyController';

const router = express.Router();

// Ruta proxy - debe ir ANTES de las rutas con parámetros
router.post('/proxy-device-data', proxyController.proxyDeviceData);

// Rutas base
router.get('/', deviceController.getAllDevices);
router.post('/', deviceController.createDevice);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);
router.put('/:id/readings', deviceController.updateDeviceReadings);

export default router; 