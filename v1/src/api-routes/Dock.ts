import validate from "../middlewares/validate";
import validationSchemas from "../validations/Dock";
import express from "express";
import Dock from "../controllers/dockController";
import authenticate from "../middlewares/authenticate";

const router = express.Router();
router
  .route("/")
  .post(authenticate, validate(validationSchemas.create), Dock.create);
router
  .route("/")
  .patch(authenticate, validate(validationSchemas.update), Dock.update);
router.
  route("/number-of-docks")
  .get(authenticate, Dock.numberOfDocks);
router.
  route("/get-docks")
  .get(authenticate, Dock.getDocks);
router
  .route("/unique-dock-filter-data")
  .get(authenticate, Dock.uniqueDockFilterData);
router.route("/").get(authenticate, Dock.list);
router.route("/upload").post(authenticate, Dock.uploadDocks);

export default router;
