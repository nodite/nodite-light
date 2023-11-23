import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';

const router: Router = Router();
const resBody = httpStatus[httpStatus.NOT_FOUND];
router.all('*', (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json(resBody);
});

export default router;
