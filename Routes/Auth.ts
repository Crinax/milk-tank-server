import { Router, Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import API from '../api/v1/api';

const authRoutes = Router();

interface IUserAuthRequest {
  name: string,
  litters: number,
}

authRoutes.get('/journal', async (req, res) => {
  res.json(await API.getJournal());
});

authRoutes.post('/fill', async (req: Request<ParamsDictionary, any, IUserAuthRequest>, res) => {
    const { name, litters } = req.body ? req.body : { name: undefined, litters: undefined }
    const userId = await API.auth(name);

    if (userId.code === 200) {
      const fillTankRes = await API.fillTank(userId.data, litters);
      res.json(fillTankRes);
    } else {
      res.json(userId);
    }
});

export default authRoutes;