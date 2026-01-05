import api from "./api";

export const fetchTodayStats = () => api.get("/dashboard/today");
export const fetchSalesByHour = () => api.get("/dashboard/sales-by-hour");

export const fetchTopProducts = (range) =>
  api.get("/dashboard/top-products", {
    params: { range }
  });

export const fetchSalesByDay = (start, end) =>
  api.get("/dashboard/sales-by-day", {
    params: { start, end }
  });