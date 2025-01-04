import express from 'express';
import deviceRoutes from './deviceRoutes';
import widgetRoutes from './widgetRoutes';

const router = express.Router();

// Quita '/devices' de aquí ya que está incluido en las rutas individuales
router.use('/', deviceRoutes);
router.use('/', widgetRoutes);

export default router; 