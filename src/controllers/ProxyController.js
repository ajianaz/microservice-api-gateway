import BaseController from "./BaseController.js";
import { getServiceDetails } from "../services/ServiceManager.js";
import { checkAccess } from "../services/ApiManager.js";

class ProxyController extends BaseController {
    constructor() {
        super(); // <-- Penting! Agar mewarisi method dari BaseController
    }

    async proxyRequest(req, reply) {
        try {
            const { service } = req.params;
            const serviceDetails = await getServiceDetails(service);

            // Handle service errors (down or maintenance)
            if (serviceDetails.error) {
                return this.resError(reply, new Error(serviceDetails.error), serviceDetails.status);
            }

            // Check access control
            const accessGranted = await checkAccess(req.user, service);
            if (!accessGranted) return this.resError(reply, new Error("Forbidden"), 403);

            return this.resSuccess(reply, { proxyTo: serviceDetails.url });
        } catch (error) {
            return this.resError(reply, error);
        }
    }
}

export default ProxyController;
