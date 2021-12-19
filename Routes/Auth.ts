import { Router, Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import API from '../api/v1/api';

const router = Router();

interface IUserAuthRequest {
  name: string,
  litters: number,
}

router.get('/', async (req, res) => {
  res.json(await API.getUsers());
});

router.post('/fill', async (req: Request<ParamsDictionary, any, IUserAuthRequest>, res) => {
    const { name, litters } = req.body;
    const userId = await API.auth(name);

    if (userId.code === 200) {
      res.json(await API.fillTank(userId.data, litters));
    } else {
      res.json(userId);
    }
});
