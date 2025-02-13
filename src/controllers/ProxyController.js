// src/controllers/ProxyController.js
import BaseController from "./BaseController.js";
import { getServiceUrl } from "../services/ServiceManager.js";
import { checkAccess } from "../services/ApiManager.js";

class ProxyController extends BaseController {
    async proxyRequest(req, reply) {
        try {
            // Ambil URL dari service manager
            const serviceUrl = await getServiceUrl(req.params.service);

            // Cek akses dari api-manager
            const accessGranted = await checkAccess(req.user, req.params.service);
            if (!accessGranted) return this.resError(reply, new Error("Forbidden"), 403);

            // Redirect request ke service tujuan
            return this.resSuccess(reply, { proxyTo: serviceUrl });
        } catch (error) {
            return this.resError(reply, error);
        }
    }
}

export default new ProxyController();
