import express from 'express';
import Shipment from '../controllers/shipmentController';
import authenticate from '../middlewares/authenticate';
import validate from '../middlewares/validate';
import validationSchemas from '../validations/Shipment'

const router = express.Router();
router.route('/').post(authenticate, validate(validationSchemas.create), Shipment.create);
router.route('/').patch(authenticate, validate(validationSchemas.update), Shipment.update);
router.route('/:id/add-sub-shipment').post(authenticate, validate(validationSchemas.addSubShipment), Shipment.addSubShipment);
router.route('/:parentShipmentId/update-sub-shipment/:subShipmentId').patch(authenticate, validate(validationSchemas.updatedSubShipment), Shipment.updatedSubShipment);
router.route('/arrived-shipments').get(authenticate, Shipment.arrivedShipments);
router.route('/todays-shipments').get(authenticate, Shipment.todaysShipments);
router.route('/last-week-shipments').get(authenticate, Shipment.numberOfLastWeekShippedShipments);
router.route('/number-of-shipment-in-this-year').get(authenticate, Shipment.numberOfShipmentInThisYear)
router.route('/number-of-shipment-in-this-month').get(authenticate, Shipment.numberOfShipmentsInThisMonth);
router.route('/status-of-shipment').get(authenticate, Shipment.statusOfShipments);
router.route('/number-of-shipment').get(authenticate, Shipment.numberOfShipments);
router.route('/unique-shipment-filter-data').get(authenticate, Shipment.uniqueFilteringData);

export default router;
