import { Request, Response } from 'express';
import Widget from '../models/Widget';

export const widgetController = {
  getAllWidgets: async (_req: Request, res: Response): Promise<void> => {
    try {
      const widgets = await Widget.find()
        .populate('device')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: widgets
      });
    } catch (error) {
      console.error('Error getting widgets:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener widgets',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      });
    }
  },

  createWidget: async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, title, device, config } = req.body;

      if (!type || !title) {
        res.status(400).json({
          success: false,
          message: 'El tipo y título son requeridos',
          requiredFields: ['type', 'title']
        });
        return;
      }

      const widget = new Widget({
        widgetId: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        title: title.trim(),
        device,
        config: config || {}
      });

      const savedWidget = await widget.save();
      const populatedWidget = await Widget.findById(savedWidget._id).populate('device');

      res.status(201).json({
        success: true,
        data: populatedWidget
      });
    } catch (error) {
      console.error('Error creating widget:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el widget',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      });
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
      ).populate('device');

      if (!updatedWidget) {
        res.status(404).json({
          success: false,
          message: 'Widget no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedWidget
      });
    } catch (error) {
      console.error('Error updating widget:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el widget',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      });
    }
  },

  deleteWidget: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedWidget = await Widget.findByIdAndDelete(id);

      if (!deletedWidget) {
        res.status(404).json({
          success: false,
          message: 'Widget no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Widget eliminado correctamente'
      });
    } catch (error) {
      console.error('Error deleting widget:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el widget',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      });
    }
  }
}; 