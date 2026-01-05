import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/medicaments", label: "Médicaments" },
  { to: "/achats", label: "Achats" },
  { to: "/stock", label: "Stock" },
  { to: "/vente", label: "Vente" },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-6">Pharmacy AL Khair</h2>

      <nav className="space-y-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md font-medium
              ${isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
