import dotenv from 'dotenv';
dotenv.config();

import session from 'express-session';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { connectToMongoDB } from './config/db.js';
import router from './routes/routes.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '../client/dist')));
app.get(/^\/(?!api|server).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.use('/api', router);
app.use('/server', account);

const startServer = async () => {
  await connectToMongoDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
