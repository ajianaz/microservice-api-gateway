// src/services/ApiManager.js
import axios from "axios";

export async function checkAccess(user, service) {
    try {
        const response = await axios.post("http://api-manager.local/check-access", { user, service });
        return response.data.access;
    } catch (err) {
        return false;
    }
}
