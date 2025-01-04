import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: { type: String, required: true },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  peripherals: { type: [String], default: [] },
  ipAddress: { 
    type: String, 
    required: true 
  },
  dataVariable: { 
    type: String, 
    required: true 
  },
  readings: {
    temperature: { type: Number, default: null },
    humidity: { type: Number, default: null },
    pressure: { type: Number, default: null },
    distance: { type: Number, default: null },
    acceleration: {
      x: { type: Number, default: null },
      y: { type: Number, default: null },
      z: { type: Number, default: null }
    }
  },
  lastSeen: { type: Date, default: Date.now }
});

const Device = mongoose.model('Device', deviceSchema);
export default Device; 