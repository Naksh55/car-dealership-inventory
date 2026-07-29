import { useState, useEffect, useCallback } from "react";
import { Car, LogOut, ShieldCheck, Plus, PackageSearch } from "lucide-react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import VehicleCard from "../components/VehicleCard";
import SearchBar from "../components/SearchBar";
import VehicleForm from "../components/VehicleForm";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await client.get("/api/vehicles");
      setVehicles(res.data);
    } catch {
      setMessage("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  async function handleSearch({ make, model, category, minPrice, maxPrice }) {
    const params = {};
    if (make) params.make = make;
    if (model) params.model = model;
    if (category) params.category = category;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;

    setLoading(true);
    try {
      const res = await client.get("/api/vehicles/search", { params });
      setVehicles(res.data);
    } catch {
      setMessage("Search failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(id) {
    try {
      await client.post(`/api/vehicles/${id}/purchase`);
      setMessage("Purchase successful!");
      loadVehicles();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Purchase failed.");
    }
  }

  async function handleRestock(id) {
    const amount = prompt("Restock amount:", "5");
    if (!amount) return;
    try {
      await client.post(`/api/vehicles/${id}/restock`, { amount: parseInt(amount, 10) });
      setMessage("Restocked successfully.");
      loadVehicles();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Restock failed.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await client.delete(`/api/vehicles/${id}`);
      setMessage("Vehicle deleted.");
      loadVehicles();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Delete failed.");
    }
  }

  async function handleFormSubmit(data) {
    try {
      if (editingVehicle) {
        await client.put(`/api/vehicles/${editingVehicle.id}`, data);
        setMessage("Vehicle updated.");
      } else {
        await client.post("/api/vehicles", data);
        setMessage("Vehicle added.");
      }
      setShowForm(false);
      setEditingVehicle(null);
      loadVehicles();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Save failed.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Car size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Car Dealership Inventory</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">{user?.email}</p>
              {user?.isAdmin && (
                <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1 justify-end">
                  <ShieldCheck size={12} /> Admin
                </p>
              )}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <SearchBar onSearch={handleSearch} onClear={loadVehicles} />

        {message && (
          <p className="text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2.5">
            {message}
          </p>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {loading ? "Loading..." : `${vehicles.length} vehicle${vehicles.length === 1 ? "" : "s"} found`}
          </p>
          {user?.isAdmin && (
            <button
              onClick={() => {
                setEditingVehicle(null);
                setShowForm(true);
              }}
              className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              <Plus size={15} /> Add Vehicle
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-slate-500">Loading vehicles...</p>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-300 rounded-2xl py-16 px-6">
            <PackageSearch className="text-slate-300 mb-3" size={44} strokeWidth={1.5} />
            <p className="text-slate-600 font-medium">No vehicles found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search filters{user?.isAdmin ? ", or add a new vehicle above" : ""}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                isAdmin={user?.isAdmin}
                onPurchase={handlePurchase}
                onRestock={handleRestock}
                onDelete={handleDelete}
                onEdit={(vehicle) => {
                  setEditingVehicle(vehicle);
                  setShowForm(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <VehicleForm
          initial={editingVehicle}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingVehicle(null);
          }}
        />
      )}
    </div>
  );
}
