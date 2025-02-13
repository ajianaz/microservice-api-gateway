// src/services/ServiceManager.js
import axios from "axios";

export async function getServiceUrl(serviceName) {
    try {
        const response = await axios.get("http://service-manager.local/services");
        const service = response.data.find((s) => s.name === serviceName);
        if (!service) throw new Error("Service not found");
        return service.url;
    } catch (err) {
        console.error("Service Manager Error:", err);
        throw new Error("Failed to fetch service URL");
    }
}
