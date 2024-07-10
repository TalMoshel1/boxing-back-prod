import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectToDb from './db/connectToDb.js';
import lessonRoutes from './routes/lesson.js';
import authRoutes from './routes/auth.js';
import messageRoute from './routes/message.js';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:3001', 'https://boxing-front.onrender.com'];

// Debug: Log allowedOrigins to verify its content
console.log('Allowed origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin); // Set to the request's origin
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Allow preflight requests
  }
  next();
});

app.use('/api/lessons', lessonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoute);

const PORT = process.env.PORT || 3000;

connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);

  });
});
