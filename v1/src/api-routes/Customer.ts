import validate from "../middlewares/validate";
import validationSchemas from "../validations/Customer";
import express from "express";
import Customer from "../controllers/customerController";
import authenticate from "../middlewares/authenticate";

const router = express.Router();
router
  .route("/")
  .post(authenticate, validate(validationSchemas.create), Customer.create);
router
  .route("/")
  .patch(authenticate, validate(validationSchemas.update), Customer.update);
router.
  route("/number-of-customers")
  .get(authenticate, Customer.numberOfCustomers);
router.
  route("/get-customers")
  .get(authenticate, Customer.getCustomers);
router
  .route("/unique-customer-filter-data")
  .get(authenticate, Customer.uniqueCustomerFilterData);
router.route("/").get(authenticate, Customer.list);
router.route("/upload").post(authenticate, Customer.uploadCustomers);

export default router;
