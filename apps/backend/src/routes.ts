import { Router } from 'express';
import { readAllController, readDataController, readSpecificController } from './controllers/booleanModel.js';

const router = Router();

const modelList = '/models';
const modelDetail = '/models/:id';
const modelDataAeon = '/models/:id/aeon';
const modelDataSbml = '/models/:id/sbml';
const modelDataBnet = '/models/:id/bnet';
const modelDataBooleannet = '/models/:id/booleannet';
const modelDataBma = '/models/:id/bma';

router.get(modelList, readAllController);
router.get(modelDetail, readSpecificController);
router.get(modelDataAeon, readDataController('text/aeon', 'text', '.aeon'));
router.get(modelDataSbml, readDataController('text/sbml', 'text/xml', '.sbml'));
router.get(modelDataBnet, readDataController('text/bnet', 'text', '.bnet'));
router.get(modelDataBooleannet, readDataController('text/booleannet', 'text', '.booleannet'));
router.get(modelDataBma, readDataController('text/bma', 'text/json', '.bma.json'));

export default router;
