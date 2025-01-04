import { Request, Response } from 'express';
import Widget from '../models/Widget';

export const widgetController = {
  getAllWidgets: async (req: Request, res: Response): Promise<void> => {
    try {
      const widgets = await Widget.find();
      res.json(widgets);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener widgets' });
    }
  },

  createWidget: async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, title, device, widgetId, config } = req.body;
      
      if (!type || !widgetId) {
        res.status(400).json({ 
          message: 'type y widgetId son requeridos',
          error: 'MISSING_REQUIRED_FIELDS'
        });
        return;
      }

      const widget = new Widget({
        widgetId,
        type,
        title: title.trim(),
        device,
        config
      });

      const savedWidget = await widget.save();
      res.status(201).json(savedWidget);
    } catch (error) {
      console.error('Error al crear widget:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Error al crear el widget',
        error: 'CREATE_WIDGET_ERROR'
      });
    }
  },

  deleteWidget: async (req: Request, res: Response): Promise<void> => {
    try {
      await Widget.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar widget' });
    }
  },

  updateWidget: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedWidget = await Widget.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updatedWidget) {
        res.status(404).json({ message: 'Widget no encontrado' });
        return;
      }

      res.json(updatedWidget);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el widget' });
    }
  }
}; 