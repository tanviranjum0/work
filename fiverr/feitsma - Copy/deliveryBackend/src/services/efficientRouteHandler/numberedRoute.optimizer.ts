import { constructRoute } from "./core.optimizer.js";
import { OptimizerResult, ShipmentDocument } from "./types.js";

/**
 * Numbered-route optimizer (sections 24–26): every shipment already
 * assigned to `routeNumber` for this shift MUST end up in the generated
 * route. The shared engine still decides sequencing, warehouse visits, and
 * quantities — this wrapper just tells it that nothing may be left out,
 * which flips the "stuck" case from "leave it unassigned" to "infeasible".
 */
export const runNumberedRouteOptimizer = (
  shipments: ShipmentDocument[],
  warehouseShipment: ShipmentDocument,
  vehicleCapacity: number,
  now: Date = new Date(),
): OptimizerResult =>
  constructRoute({
    mode: "numbered",
    shipments,
    warehouseShipment,
    vehicleCapacity,
    now,
  });
