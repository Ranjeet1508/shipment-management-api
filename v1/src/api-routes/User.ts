import validate from "../middlewares/validate";
import validationSchemas from '../validations/User';
import express from 'express';
import User from '../controllers/userController';

const router = express.Router();

router.route('/').post(validate(validationSchemas.create), User.create)

export default router;