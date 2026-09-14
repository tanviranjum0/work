import express from "express";
import {
  handleCreateNewShipment,
  handleInitialHomePageLoad,
  handleGetSingleShipment,
  handleGetInitialShipments,
  handleShipmentsSearch,
  handleLoadMoreShipments,
  handleDeleteOneShipment,
  handleGetRouteId,
  handleShipmentStatusUpdate,
  handleShipmentUpdate,
  handleGetSpecificNumberBasedShipments,
} from "../controllers/shipment.controller.js";
import checkLogin from "../utils/checkLogin.js";

const router = express.Router();

router.get(
  "/more",
  checkLogin,
  handleLoadMoreShipments as unknown as express.RequestHandler,
);
router.get(
  "/search",
  checkLogin,
  handleShipmentsSearch as unknown as express.RequestHandler,
);
router.get(
  "/home",
  checkLogin,
  handleInitialHomePageLoad as unknown as express.RequestHandler,
);
router.get(
  "/:id",
  checkLogin,
  handleGetSingleShipment as unknown as express.RequestHandler,
);
router.get(
  "/",
  checkLogin,
  handleGetInitialShipments as unknown as express.RequestHandler,
);
router.get(
  "/specific/routenumber",
  checkLogin,
  handleGetSpecificNumberBasedShipments,
);

router.post(
  "/routeid",
  checkLogin,
  handleGetRouteId as unknown as express.RequestHandler,
);
router.post(
  "/create",
  checkLogin,
  handleCreateNewShipment as unknown as express.RequestHandler,
);
router.post(
  "/update",
  checkLogin,
  handleShipmentUpdate as unknown as express.RequestHandler,
);

router.patch(
  "/status",
  checkLogin,
  handleShipmentStatusUpdate as unknown as express.RequestHandler,
);

router.delete(
  "/:id",
  checkLogin,
  handleDeleteOneShipment as unknown as express.RequestHandler,
);

export default router;
