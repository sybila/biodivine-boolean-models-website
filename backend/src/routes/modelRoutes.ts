import { Router} from "express";
import {readAllModelsController, readSpecificModelController} from "../controllers/model/read";
// import {createModelController} from "../controllers/model/create";

const modelRouter = Router();

const routerModel = "/models";
const routerModelWithId = "/models/:id";

modelRouter.get(routerModel, readAllModelsController);
modelRouter.get(routerModelWithId, readSpecificModelController);

// Route for creating new model - unused in this web app, possible to uncomment if needed later
// modelRouter.post(routerModel, createModelController);

export default modelRouter;
