import express from 'express';
import { widgetController } from '../controllers/widgetController';

const router = express.Router();

router.get('/', widgetController.getAllWidgets);
router.post('/', widgetController.createWidget);
router.put('/:id', widgetController.updateWidget);
router.delete('/:id', widgetController.deleteWidget);

export default router; 