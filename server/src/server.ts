import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dataRoutes from './routes/dataRoutes';

// Load environment variables from .env file
dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());            // Enable Cross-Origin Resource Sharing
app.use(express.json());    // Parse JSON bodies

// Route handling for data endpoints
app.use('/api/data', dataRoutes);

// Server port from env or fallback to 4000
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
