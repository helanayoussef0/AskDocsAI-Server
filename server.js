import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/', chatRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('OpenAI API Key status:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
});
