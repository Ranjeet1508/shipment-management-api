import validate from "../middlewares/validate";
import validationSchemas from '../validations/User';
import express from 'express';
import User from '../controllers/userController';
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.route('/').post(validate(validationSchemas.create), User.create)
router.route('/login').post(validate(validationSchemas.login), User.login)
router.route('/change-password').post(authenticate, validate(validationSchemas.changePassword), User.changePassword)
router.route('/').get(authenticate, User.getProfile)
router.route('/billing-information').get(authenticate, User.getBillingInformation)
router.route('/billing-information').patch(authenticate, validate(validationSchemas.updateBillingInformation), User.updateBillingInformation)
router.route('/forgot-password').post(validate(validationSchemas.forgotPassword), User.forgotPassword)

export default router;