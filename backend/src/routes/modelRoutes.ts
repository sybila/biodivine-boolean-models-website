import { Router} from "express";
import {readAllModelsController, readSpecificModelController} from "../controllers/model/read";
// import {deleteModelController} from "../controllers/model/delete";
// import {updateModelController} from "../controllers/model/update";
// import {createModelController} from "../controllers/model/create";

const modelRouter = Router();

const routerModel = "/models";
const routerModelWithId = "/models/:id";

modelRouter.get(routerModel, readAllModelsController);
modelRouter.get(routerModelWithId, readSpecificModelController);

// Route for creating new model - unused in this web app, possible to uncomment if needed later
// modelRouter.post(routerModel, createModelController);
// modelRouter.patch(routerModelWithId, updateModelController);
// modelRouter.delete(routerModelWithId, deleteModelController);

export default modelRouter;
