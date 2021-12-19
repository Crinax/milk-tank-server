import { Router, Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import API from '../api/v1/api';

const authRoutes = Router();

interface IUserAuthRequest {
  name: string,
  litters: number,
}

authRoutes.get('/', async (req, res) => {
  res.json(await API.getUsers());
});

authRoutes.post('/fill', async (req: Request<ParamsDictionary, any, IUserAuthRequest>, res) => {
    const { name, litters } = req.body ? req.body : { name: undefined, litters: undefined }
    const userId = await API.auth(name);

    console.log(req.body);

    if (userId.code === 200) {
      const fillTankRes = await API.fillTank(userId.data, litters);

      res.status(fillTankRes.code);
      res.json(fillTankRes);
    } else {
      res.status(userId.code);
      res.json(userId);
    }
});

export default authRoutes;