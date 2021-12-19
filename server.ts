import express from 'express';
import morgan from 'morgan';

import API from './api/v1/api';

const app = express();

API.connect();
app.set('port', 3000);
app.use(morgan('dev'));
app.use('/api/v1', require('./Routes/Auth'));

app.listen(app.get('port'), () => {
  console.log(`[OK] Server running at  http://localhost:${app.get('port')}`);
});