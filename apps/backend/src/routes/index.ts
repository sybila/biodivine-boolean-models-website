import { Router } from 'express';
import { readAllController, readSpecificController } from '../controllers/booleanModel/read';

const router = Router();

const modelList = '/models';
const modelDetail = '/models/:id';

router.get(modelList, readAllController);
router.get(modelDetail, readSpecificController);

export default router;
