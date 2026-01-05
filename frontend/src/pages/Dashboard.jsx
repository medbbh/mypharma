import { useEffect, useState } from "react";
import {
  fetchTodayStats,
  fetchTopProducts,
  fetchSalesByHour,
  fetchSalesByDay
} from "../services/dashboard";

export default function Dashboard() {
  const [today, setToday] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [byHour, setByHour] = useState([]);
  const [byDay, setByDay] = useState([]);

  const [range, setRange] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const ranges = [
    { key: "today", label: "Aujourd’hui" },
    { key: "7", label: "7j" },
    { key: "14", label: "14j" },
    { key: "30", label: "30j" },
  ];

  /* ───────────── LOAD DATA ───────────── */
  useEffect(() => {
    fetchTodayStats().then(r => setToday(r.data));
    fetchSalesByHour().then(r => setByHour(r.data));
  }, []);

  useEffect(() => {
    fetchTopProducts(range).then(r => setTopProducts(r.data));
  }, [range]);

  useEffect(() => {
    fetchSalesByDay(startDate, endDate).then(r => setByDay(r.data));
  }, [startDate, endDate]);

  /* ───────────── UI ───────────── */
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* ───── TODAY REVENUE (HERO CARD) ───── */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <p className="text-sm text-gray-500">
          Chiffre d’affaires — Aujourd’hui
        </p>
        <p className="text-4xl font-bold mt-2">
          {today.revenue ?? 0}
        </p>
      </div>

      {/* ───── TOP PRODUCTS + SALES BY HOUR ───── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Top Products */}
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-sm">
              Produits les plus vendus
            </h2>

            <div className="flex bg-gray-100 rounded-lg p-1">
              {ranges.map(r => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`px-3 py-1 text-sm rounded-md transition
                    ${range === r.key
                      ? "bg-white shadow font-medium"
                      : "text-gray-500 hover:text-gray-700"}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucune donnée</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {topProducts.map((p, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-gray-700">
                    {p.medicament}
                  </span>
                  <span className="font-medium">
                    {p.total_sold}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sales by Hour */}
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="font-semibold text-sm mb-3">
            Heures les plus actives
          </h2>

          <div className="flex flex-wrap gap-2">
            {byHour.map(h => (
              <div
                key={h.hour}
                className="bg-gray-100 px-3 py-1 rounded-lg text-sm"
              >
                <span className="font-medium">
                  {h.hour}h
                </span>
                <span className="text-gray-500">
                  {" "}· {h.sales}
                </span>
              </div>
            ))}

            {byHour.length === 0 && (
              <p className="text-gray-400 text-sm">
                Aucune donnée
              </p>
            )}
          </div>
        </div>

      </div>

      {/* ───── SALES BY DAY (CALENDAR) ───── */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <h2 className="font-semibold text-sm mb-3">
          Ventes par jour
        </h2>

        <div className="flex gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-500">
              Début
            </label>
            <input
              type="date"
              className="border p-1 rounded text-sm"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">
              Fin
            </label>
            <input
              type="date"
              className="border p-1 rounded text-sm"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {byDay.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Aucune donnée
          </p>
        ) : (
          <ul className="space-y-1 text-sm">
            {byDay.map((d, i) => (
              <li key={i} className="flex justify-between">
                <span className="text-gray-600">
                  {d.day}
                </span>
                <span className="font-medium">
                  {d.revenue}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
