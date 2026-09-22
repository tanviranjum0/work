import { runMixedRouteOptimizer } from "./mixedRoute.optimizer.js";
import { runNumberedRouteOptimizer } from "./numberedRoute.optimizer.js";
import { OptimizerResult, RouteType, ShipmentDocument } from "./types.js";

export interface OptimizeRouteParams {
  routeType: RouteType;
  shipments: ShipmentDocument[];
  warehouseShipment: ShipmentDocument;
  vehicleCapacity: number;
  now?: Date;
}

/**
 * Single entry point the Express handler calls. Picks the optimizer based
 * on routeType and returns its result untouched — all the actual logic
 * lives in core.optimizer.ts, mixedRoute.optimizer.ts, and
 * numberedRoute.optimizer.ts.
 */
export const optimizeRoute = ({
  routeType,
  shipments,
  warehouseShipment,
  vehicleCapacity,
  now = new Date(),
}: OptimizeRouteParams): OptimizerResult =>
  routeType === "mixed"
    ? runMixedRouteOptimizer(shipments, warehouseShipment, vehicleCapacity, now)
    : runNumberedRouteOptimizer(
        shipments,
        warehouseShipment,
        vehicleCapacity,
        now,
      );

export {
  buildWarehouseTemplate,
  createWarehouseVisitShipments,
  generateRouteNumber,
} from "./warehouse.service.js";
export { validateRequestBody, validateShipment } from "./validation.service.js";
