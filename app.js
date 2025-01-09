import express from 'express';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import mapRoutes from './routes/mapRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/maps', mapRoutes);

app.get('/', (req, res) => {
  res.send('Hospital API is running!');
});

export default app;
