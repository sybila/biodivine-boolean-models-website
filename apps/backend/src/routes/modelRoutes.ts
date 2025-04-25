import { Router } from 'express';
import { readAllModelsController, readSpecificModelController } from '../controllers/model/read';

const modelRouter = Router();

const routerModel = '/models';
const routerModelWithId = '/models/:id';

modelRouter.get(routerModel, readAllModelsController);
modelRouter.get(routerModelWithId, readSpecificModelController);

export default modelRouter;
