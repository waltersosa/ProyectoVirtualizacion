import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
  deviceId: string;
  name: string;
  type: string;
  peripherals: string[];
  ipAddress: string;
  dataVariable: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
  readings: {
    temperature?: number | null;
    humidity?: number | null;
    pressure?: number | null;
    distance?: number | null;
    relay?: boolean;
    acceleration?: {
      x: number | null;
      y: number | null;
      z: number | null;
    };
  };
}

const DeviceSchema: Schema = new Schema({
  deviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  peripherals: [{ type: String }],
  ipAddress: { type: String, required: true },
  dataVariable: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['online', 'offline'], 
    default: 'offline' 
  },
  lastSeen: { type: Date },
  readings: {
    temperature: { type: Number, default: null },
    humidity: { type: Number, default: null },
    pressure: { type: Number, default: null },
    distance: { type: Number, default: null },
    relay: { type: Boolean, default: false },
    acceleration: {
      x: { type: Number, default: null },
      y: { type: Number, default: null },
      z: { type: Number, default: null }
    }
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las consultas
DeviceSchema.index({ deviceId: 1 }, { unique: true });
DeviceSchema.index({ name: 1 });
DeviceSchema.index({ status: 1 });

export default mongoose.model<IDevice>('Device', DeviceSchema); 