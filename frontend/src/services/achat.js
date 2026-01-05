import api from "./api";

export const fetchFournisseurs = () => api.get("/fournisseurs");
export const fetchMedicaments = () => api.get("/medicaments");
export const createAchat = (payload) => api.post("/achats", payload);
