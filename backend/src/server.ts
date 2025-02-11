import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Device } from './models/device';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iot-dashboard';

// Opciones de conexión de MongoDB
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
  autoIndex: true, // Construir índices
};

// Conectar a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB at:', MONGODB_URI);
    
    // Iniciar el servidor solo después de conectar a MongoDB
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Manejar errores de conexión
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Manejar la desconexión
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Manejar el cierre de la aplicación
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

// Ruta para eliminar un dispositivo
app.delete('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Device.findByIdAndDelete(id);
    res.json({ success: true, message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ success: false, message: 'Error deleting device' });
  }
});

// Ruta para actualizar un dispositivo
app.put('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const device = await Device.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    
    res.json({ success: true, data: device });
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ success: false, message: 'Error updating device' });
  }
}); 