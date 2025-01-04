import { Request, Response } from 'express';
import Device from '../models/Device';
import mongoose from 'mongoose';

export const deviceController = {
  getAllDevices: async (req: Request, res: Response): Promise<void> => {
    try {
      const devices = await Device.find();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener dispositivos' });
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
      
      if (!deviceId || !ipAddress || !dataVariable) {
        res.status(400).json({ 
          message: 'deviceId, ipAddress y dataVariable son requeridos',
          error: 'MISSING_REQUIRED_FIELDS'
        });
        return;
      }

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
          acceleration: { x: null, y: null, z: null }
        }
      });

      const savedDevice = await device.save();
      res.status(201).json(savedDevice);
    } catch (error) {
      console.error('Error al crear dispositivo:', error);
      res.status(500).json({ 
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