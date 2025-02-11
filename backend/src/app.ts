import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use('/api', routes);

export default app; 