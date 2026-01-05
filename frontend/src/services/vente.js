import api from "./api";

export const fetchMedicaments = () => api.get("/medicaments");
export const createVente = (payload) => api.post("/ventes", payload);
export const previewVente = (params) => api.get("/ventes/preview", { params });