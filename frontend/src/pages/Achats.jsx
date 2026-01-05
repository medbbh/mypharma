import { useEffect, useState } from "react";
import { fetchFournisseurs, fetchMedicaments, createAchat } from "../services/achat";

export default function Achats() {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [medicaments, setMedicaments] = useState([]);
    const [fournisseurId, setFournisseurId] = useState("");
    const [dateAchat, setDateAchat] = useState("");
    const [numeroFacture, setNumeroFacture] = useState("");
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchFournisseurs().then(r => setFournisseurs(r.data));
        fetchMedicaments().then(r => setMedicaments(r.data));
    }, []);

    const addItem = () => {
        setItems([...items, {
            medicament_id: "",
            lot: "",
            date_expiration: "",
            quantite: 1,
            prix_unitaire: 0
        }]);
    };

    const updateItem = (idx, key, value) => {
        const copy = [...items];
        copy[idx][key] = value;
        setItems(copy);
    };

    const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const total = items.reduce(
        (s, i) => s + (Number(i.quantite) * Number(i.prix_unitaire || 0)), 0
    );

    const submit = async () => {
        setError(""); setSuccess("");
        if (!fournisseurId || !dateAchat || items.length === 0) {
            setError("Veuillez remplir les champs obligatoires");
            return;
        }
        try {
            await createAchat({
                fournisseur_id: Number(fournisseurId),
                date_achat: dateAchat,
                numero_facture: numeroFacture,
                items: items.map(i => ({
                    ...i,
                    medicament_id: Number(i.medicament_id),
                    quantite: Number(i.quantite),
                    prix_unitaire: Number(i.prix_unitaire)
                }))
            });
            setSuccess("Achat enregistré avec succès");
            setItems([]);
            setNumeroFacture("");
        } catch {
            setError("Erreur lors de l’enregistrement de l’achat");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Achats</h1>

            {/* Header */}
            <div className="bg-white p-4 rounded shadow grid grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Fournisseur
                    </label>
                    <select
                        className="border p-2 rounded w-full"
                        value={fournisseurId}
                        onChange={e => setFournisseurId(e.target.value)}
                    >
                        <option value="">Sélectionner</option>
                        {fournisseurs.map(f => (
                            <option key={f.id} value={f.id}>{f.nom}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Date d’achat
                    </label>
                    <input
                        type="date"
                        className="border p-2 rounded w-full"
                        value={dateAchat}
                        onChange={e => setDateAchat(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Numéro de facture
                    </label>
                    <input
                        className="border p-2 rounded w-full"
                        placeholder="FAC-001"
                        value={numeroFacture}
                        onChange={e => setNumeroFacture(e.target.value)}
                    />
                </div>

                <div className="flex flex-col justify-end font-semibold">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-lg">{total.toFixed(2)} MRU</span>
                </div>
            </div>


            {/* Items */}
            <div className="bg-white p-4 rounded shadow space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold">Articles</h2>
                    <button onClick={addItem} className="bg-blue-600 text-white px-3 py-1 rounded">
                        + Ajouter
                    </button>
                </div>

                {items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-6 gap-2 items-end">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Médicament</label>
                            <select
                                className="border p-2 rounded w-full"
                                value={it.medicament_id}
                                onChange={e => updateItem(idx, "medicament_id", e.target.value)}
                            >
                                <option value="">Choisir</option>
                                {medicaments.map(m => (
                                    <option key={m.id} value={m.id}>{m.nom_commercial}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Lot</label>
                            <input
                                className="border p-2 rounded w-full"
                                value={it.lot}
                                onChange={e => updateItem(idx, "lot", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Expiration</label>
                            <input
                                type="date"
                                className="border p-2 rounded w-full"
                                value={it.date_expiration}
                                onChange={e => updateItem(idx, "date_expiration", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Quantité</label>
                            <input
                                type="number"
                                min="1"
                                className="border p-2 rounded w-full"
                                value={it.quantite}
                                onChange={e => updateItem(idx, "quantite", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Prix unitaire en MRU</label>
                            <input
                                type="number"
                                step="0.01"
                                className="border p-2 rounded w-full"
                                value={it.prix_unitaire}
                                onChange={e => updateItem(idx, "prix_unitaire", e.target.value)}
                            />
                        </div>

                        <button
                            onClick={() => removeItem(idx)}
                            className="text-red-600 mb-1"
                            title="Supprimer la ligne"
                        >
                            🗑️
                        </button>
                    </div>

                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button onClick={submit} className="bg-green-600 text-white px-4 py-2 rounded">
                    Enregistrer
                </button>
                {error && <p className="text-red-600">{error}</p>}
                {success && <p className="text-green-600">{success}</p>}
            </div>
        </div>
    );
}
