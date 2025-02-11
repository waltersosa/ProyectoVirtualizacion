import express from 'express';
import deviceRoutes from './deviceRoutes';
import widgetRoutes from './widgetRoutes';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Quita '/devices' de aquí ya que está incluido en las rutas individuales
router.use('/devices', deviceRoutes);
router.use('/widgets', widgetRoutes);

export default router; 