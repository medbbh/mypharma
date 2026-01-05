import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Layout from "./layout/Layout"
import Dashboard from "./pages/Dashboard";
import Medicaments from "./pages/Medicaments";
import Achats from "./pages/Achats";
import Stock from "./pages/Stock";
import Vente from "./pages/Vente";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/medicaments" element={<Medicaments />} />
        <Route path="/achats" element={<Achats />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/vente" element={<Vente />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);
