import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
// import bodyParser from 'body-parser';

import authRoutes from './Routes/Auth';
import Logger from './Logger';
import API from './api/v1/api';

const app = express();

API.connect();
app.use(cors());
app.all('*', function(req, res, next) {
  var origin = req.get('origin'); 
  res.header('Access-Control-Allow-Origin', origin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.set('port', 3000);
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1', authRoutes);

app.listen(app.get('port'), () => {
  Logger.log(`Server started successfully at http://localhost:${app.get('port')}`);
  console.log(`[Server] Server running at http://localhost:${app.get('port')}`);
});