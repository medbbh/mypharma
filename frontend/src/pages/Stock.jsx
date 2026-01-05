import { useEffect, useState } from "react";
import {
  fetchStock,
  fetchExpirationAlerts,
  fetchLowStockAlerts
} from "../services/stock";

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [expAlerts, setExpAlerts] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchStock().then(r => setStock(r.data));
    fetchExpirationAlerts().then(r => setExpAlerts(r.data));
    fetchLowStockAlerts().then(r => setLowStock(r.data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Stock</h1>

      {/* Alerts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Expiration */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3 text-orange-600">
            ⏰ Expiration proche
          </h2>

          {expAlerts.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucune alerte</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {expAlerts.map((a, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {a.medicament} — Lot {a.lot}
                  </span>
                  <span
                    className={
                      a.status === "expired"
                        ? "text-red-600"
                        : "text-orange-600"
                    }
                  >
                    {a.date_expiration}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3 text-red-600">
            📉 Stock faible
          </h2>

          {lowStock.length === 0 ? (
            <p className="text-gray-500 text-sm">Stock OK</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {lowStock.map(s => (
                <li key={s.medicament_id} className="flex justify-between">
                  <span>{s.nom_commercial}</span>
                  <span className="text-red-600">
                    {s.total_stock}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Stock table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Médicament</th>
              <th className="p-2 text-right">Quantité</th>
            </tr>
          </thead>
          <tbody>
            {stock.map(s => (
              <tr key={s.medicament_id} className="border-t">
                <td className="p-2">{s.nom_commercial}</td>
                <td className="p-2 text-right font-medium">
                  {s.total_stock}
                </td>
              </tr>
            ))}

            {stock.length === 0 && (
              <tr>
                <td colSpan="2" className="p-4 text-center text-gray-500">
                  Aucun stock
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
