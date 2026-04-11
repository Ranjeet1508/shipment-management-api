import validate from "../middlewares/validate";
import validationSchemas from "../validations/Carrier";
import express from "express";
import Carrier from "../controllers/carrierController";
import authenticate from "../middlewares/authenticate";

const router = express.Router();
router
  .route("/")
  .post(authenticate, validate(validationSchemas.create), Carrier.create);
router
  .route("/")
  .patch(authenticate, validate(validationSchemas.update), Carrier.update);
router.
  route("/number-of-carriers")
  .get(authenticate, Carrier.numberOfCarriers);
router.
  route("/get-carriers")
  .get(authenticate, Carrier.getCarriers);
router
  .route("/unique-carrier-filter-data")
  .get(authenticate, Carrier.uniqueCarrierFilterData);
router.route("/").get(authenticate, Carrier.list);
router.route("/upload").post(authenticate, Carrier.uploadCarriers);

export default router;
