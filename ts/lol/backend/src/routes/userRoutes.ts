import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

router.post('/sign', userController.sign);
router.get('/check', userController.check);
router.post('/create', userController.create);
router.post('/pet', userController.addPet);
router.post('/colors', userController.addColors);
router.get('/users', userController.getAllUsers);
export default router;