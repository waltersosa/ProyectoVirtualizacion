import { Request, Response } from 'express';
import Device from '../models/Device';
import mongoose from 'mongoose';

export const deviceController = {
  getAllDevices: async (_req: Request, res: Response): Promise<void> => {
    try {
      const devices = await Device.find().sort({ createdAt: -1 });
      
      // Asegurarse de que cada dispositivo tenga un estado inicial del relay
      const devicesWithState = devices.map(device => ({
        ...device.toObject(),
        readings: {
          ...device.readings,
          relay: device.readings?.relay ?? false // Valor por defecto false si no existe
        }
      }));

      res.status(200).json({
        success: true,
        data: devicesWithState
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener dispositivos',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      });
    }
  },

  createDevice: async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        name, 
        type, 
        peripherals, 
        deviceId, 
        ipAddress, 
        dataVariable 
      } = req.body;

      // Validaciones
      if (!name || !type || !deviceId || !ipAddress || !dataVariable) {
        res.status(400).json({ 
          success: false,
          message: 'Faltan campos requeridos',
          requiredFields: ['name', 'type', 'deviceId', 'ipAddress', 'dataVariable']
        });
        return;
      }

      // Verificar si ya existe un dispositivo con el mismo deviceId
      const existingDevice = await Device.findOne({ deviceId });
      if (existingDevice) {
        res.status(400).json({
          success: false,
          message: 'Ya existe un dispositivo con ese ID'
        });
        return;
      }

      // Crear el dispositivo
      const device = new Device({
        deviceId,
        name: name.trim(),
        type,
        peripherals: peripherals || [],
        ipAddress,
        dataVariable,
        status: 'offline',
        readings: {
          temperature: null,
          humidity: null,
          pressure: null,
          distance: null,
          acceleration: { x: null, y: null, z: null },
          relay: false
        }
      });

      const savedDevice = await device.save();
      
      res.status(201).json({
        success: true,
        data: savedDevice
      });
    } catch (error) {
      console.error('Error creating device:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear el dispositivo',
        error: 'CREATE_DEVICE_ERROR'
      });
    }
  },

  deleteDevice: async (req: Request, res: Response): Promise<void> => {
    try {
      await Device.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar dispositivo' });
    }
  },

  updateDevice: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingDevice = await Device.findOne({ 
        name: updateData.name, 
        _id: { $ne: id } 
      });

      if (existingDevice) {
        res.status(400).json({ 
          message: 'Un dispositivo con ese nombre ya existe' 
        });
        return;
      }

      const updatedDevice = await Device.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updatedDevice) {
        res.status(404).json({ message: 'Dispositivo no encontrado' });
        return;
      }

      res.json(updatedDevice);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el dispositivo' });
    }
  },

  updateDeviceReadings: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { 
        temperature, 
        humidity, 
        pressure, 
        distance, 
        acceleration,
        status,
        lastSeen 
      } = req.body;

      const updatedDevice = await Device.findByIdAndUpdate(
        id,
        {
          $set: {
            'readings.temperature': temperature,
            'readings.humidity': humidity,
            'readings.pressure': pressure,
            'readings.distance': distance,
            'readings.acceleration': acceleration,
            status: status || 'online',
            lastSeen: lastSeen || new Date()
          }
        },
        { new: true }
      );

      if (!updatedDevice) {
        res.status(404).json({ message: 'Dispositivo no encontrado' });
        return;
      }

      res.json(updatedDevice);
    } catch (error) {
      console.error('Error updating device readings:', error);
      res.status(500).json({ 
        message: 'Error al actualizar lecturas del dispositivo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}; 