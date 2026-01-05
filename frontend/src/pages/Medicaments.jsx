import { useEffect, useState } from "react";
import api from "../services/api";

export default function Medicaments() {
  const [medicaments, setMedicaments] = useState([]);
  const [form, setForm] = useState({
    nom_commercial: "",
    nom_scientifique: "",
    molecule: "",
    dosage: "",
    forme: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadMedicaments = async () => {
    const res = await api.get("/medicaments");
    setMedicaments(res.data);
  };

  useEffect(() => {
    loadMedicaments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      nom_commercial: "",
      nom_scientifique: "",
      molecule: "",
      dosage: "",
      forme: "",
    });
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/medicaments/${editingId}`, form);
      } else {
        await api.post("/medicaments", form);
      }
      resetForm();
      loadMedicaments();
    } catch (err) {
      setError("Erreur: médicament déjà existant ou données invalides");
    }
  };

  const handleEdit = (m) => {
    setForm(m);
    setEditingId(m.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Archiver ce médicament ?")) return;
    await api.delete(`/medicaments/${id}`);
    loadMedicaments();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Médicaments</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow grid grid-cols-5 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Nom commercial
          </label>
          <input
            name="nom_commercial"
            value={form.nom_commercial}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Nom scientifique
          </label>
          <input
            name="nom_scientifique"
            value={form.nom_scientifique}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Molécule
          </label>
          <input
            name="molecule"
            value={form.molecule}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Dosage
          </label>
          <input
            name="dosage"
            value={form.dosage}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="ex: 500 mg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Forme
          </label>
          <input
            name="forme"
            value={form.forme}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="comprimé, sirop…"
            required
          />
        </div>

        {/* Actions */}
        <div className="col-span-5 flex gap-2 mt-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "Modifier" : "Ajouter"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Annuler
            </button>
          )}
        </div>

        {error && (
          <p className="col-span-5 text-red-600 text-sm">{error}</p>
        )}
      </form>


      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Nom</th>
              <th className="p-2 text-left">Scientifique</th>
              <th className="p-2 text-left">Molécule</th>
              <th className="p-2 text-left">Dosage</th>
              <th className="p-2 text-left">Forme</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicaments.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-2">{m.nom_commercial}</td>
                <td className="p-2">{m.nom_scientifique}</td>
                <td className="p-2">{m.molecule}</td>
                <td className="p-2">{m.dosage}</td>
                <td className="p-2">{m.forme}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(m)}
                    className="text-blue-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-600"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {medicaments.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Aucun médicament
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
