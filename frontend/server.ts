import express, { Request, Response } from 'express';
import { SerialPort } from 'serialport';

const app = express();
const PORT = 3000;

app.get('/connect', async (req: Request, res: Response) => {
  try {
    const port = new SerialPort({ path: 'COM3', baudRate: 9600 });

    port.on('data', (data: Buffer) => {
      console.log('Data received:', data.toString());
      res.json({ message: 'Data received', data: data.toString() });
    });

    port.on('error', (err: Error) => {
      console.error('Error:', err.message);
      res.status(500).json({ error: 'Failed to connect' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
