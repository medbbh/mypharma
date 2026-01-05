import api from "./api";

export const fetchStock = () => api.get("/stock");
export const fetchExpirationAlerts = () => api.get("/alerts/expiration");
export const fetchLowStockAlerts = () => api.get("/alerts/low-stock");
