import fs from "fs";
import path from "path";

const servicesFilePath = path.join(process.cwd(), "src/config/services.json");

// Function to get service details
export async function getServiceDetails(serviceName) {
    try {
        // Read and parse services.json
        const data = fs.readFileSync(servicesFilePath, "utf-8");
        const { services } = JSON.parse(data);

        // Find the service by name
        const service = services.find((s) => s.name === serviceName);
        if (!service) return { error: "Service not found", status: 404 };

        // Check if service is down
        if (service.status === 0) {
            return { error: "Service unavailable", message: service.message, status: 503 };
        }

        // Check if service is under maintenance
        if (service.is_maintenance) {
            return { error: "Service is under maintenance", message: service.message, status: 503 };
        }

        return { url: service.url, status: 200 };
    } catch (error) {
        console.error("Error reading services.json:", error);
        return { error: "Internal Server Error", status: 500 };
    }
}
