import { useEffect, useState } from "react";
import { fetchMedicaments, previewVente, createVente } from "../services/vente";

export default function Vente() {
    const [medicaments, setMedicaments] = useState([]);
    const [search, setSearch] = useState("");

    const [cart, setCart] = useState([]);
    const [previewError, setPreviewError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMedicaments().then(res => setMedicaments(res.data));
    }, []);

    /* ───────────── FILTER MEDICAMENTS ───────────── */
    const filteredMedicaments = medicaments.filter(m =>
        m.nom_commercial.toLowerCase().includes(search.toLowerCase())
    );

    /* ───────────── ADD / UPDATE ITEM ───────────── */
    const updateQuantity = async (medicament, quantite) => {
        if (quantite <= 0) {
            removeFromCart(medicament.id);
            return;
        }

        try {
            const res = await previewVente({
                medicament_id: medicament.id,
                quantite
            });

            setPreviewError("");

            setCart(prev => {
                const exists = prev.find(i => i.medicament_id === medicament.id);

                if (exists) {
                    return prev.map(i =>
                        i.medicament_id === medicament.id
                            ? {
                                ...i,
                                quantite,
                                prix_unitaire: res.data.prix_unitaire,
                                total: res.data.total
                            }
                            : i
                    );
                }

                return [
                    ...prev,
                    {
                        medicament_id: medicament.id,
                        nom: medicament.nom_commercial,
                        quantite,
                        prix_unitaire: res.data.prix_unitaire,
                        total: res.data.total
                    }
                ];
            });
        } catch (e) {
            setPreviewError(
                e?.response?.data?.error || "Stock insuffisant"
            );
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(i => i.medicament_id !== id));
    };

    /* ───────────── TOTAL ───────────── */
    const totalGlobal = cart.reduce((s, i) => s + i.total, 0);

    /* ───────────── VALIDATE ───────────── */
    const validateVente = async () => {
        if (cart.length === 0) return;

        try {
            setLoading(true);
            await createVente({
                items: cart.map(i => ({
                    medicament_id: i.medicament_id,
                    quantite: i.quantite
                }))
            });

            alert("Vente enregistrée ✅");
            setCart([]);
            setSearch("");
        } catch (e) {
            alert(e?.response?.data?.error || "Erreur lors de la vente");
        } finally {
            setLoading(false);
        }
    };

    /* ───────────── UI ───────────── */
    return (
        <div className="h-full">
            <h1 className="text-2xl font-bold mb-4">Vente</h1>

            <div className="grid grid-cols-2 gap-6 h-[calc(100%-3rem)]">

                {/* ───── LEFT: PREVIEW / CART ───── */}
                <div className="bg-white p-6 rounded shadow flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Panier</h2>

                    {cart.length === 0 ? (
                        <p className="text-gray-500">Aucun article sélectionné</p>
                    ) : (
                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {cart.map(item => (
                                <div
                                    key={item.medicament_id}
                                    className="flex justify-between items-center border-b pb-2"
                                >
                                    <div>
                                        <p className="font-medium">{item.nom}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.quantite} × {item.prix_unitaire} MRU
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">{item.total} MRU</span>
                                        <button
                                            onClick={() => removeFromCart(item.medicament_id)}
                                            className="text-red-600"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between text-xl font-bold mb-3">
                            <span>Total</span>
                            <span>{totalGlobal} MRU</span> 
                        </div>

                        <button
                            onClick={validateVente}
                            disabled={loading || cart.length === 0}
                            className="bg-green-600 text-white w-full py-3 rounded text-lg disabled:opacity-60"
                        >
                            {loading ? "Traitement..." : "Valider la vente"}
                        </button>
                    </div>
                </div>

                {/* ───── RIGHT: MEDICAMENT LIST ───── */}
                <div className="bg-white p-6 rounded shadow flex flex-col border-l">

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Rechercher un médicament
                        </label>
                        <input
                            className="border p-2 rounded w-full"
                            placeholder="Tapez le nom..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2">
                        {filteredMedicaments.map(m => {
                            const cartItem = cart.find(i => i.medicament_id === m.id);
                            const isSelected = !!cartItem;

                            return (
                                <div
                                    key={m.id}
                                    className={`flex items-center justify-between border rounded p-2
          ${isSelected ? "bg-blue-50 border-blue-300" : ""}`}
                                >
                                    {/* LEFT: checkbox + name */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    updateQuantity(m, 1); // auto set qty = 1
                                                } else {
                                                    removeFromCart(m.id);
                                                }
                                            }}
                                        />
                                        <span className="font-medium">{m.nom_commercial}</span>
                                    </div>

                                    {/* RIGHT: quantity */}
                                    <input
                                        type="number"
                                        min="1"
                                        disabled={!isSelected}
                                        className={`border p-1 rounded w-20 text-center
            ${!isSelected ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                        value={cartItem?.quantite || ""}
                                        placeholder="1"
                                        onChange={e =>
                                            updateQuantity(m, Number(e.target.value))
                                        }
                                    />
                                </div>
                            );
                        })}

                        {filteredMedicaments.length === 0 && (
                            <p className="text-gray-500 text-sm">
                                Aucun médicament trouvé
                            </p>
                        )}
                    </div>


                    {previewError && (
                        <p className="text-red-600 text-sm mt-2">
                            {previewError}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}
