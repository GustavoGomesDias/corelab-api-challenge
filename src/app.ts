/* eslint-disable import/first */
import dotenv from 'dotenv';
import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import testAPI from './routes/api';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: '*',
  preflightContinue: false,
};

const app: Express = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(options));

app.use('/api/', testAPI);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`== 📣 Server running at ${port}! ==`);
});
