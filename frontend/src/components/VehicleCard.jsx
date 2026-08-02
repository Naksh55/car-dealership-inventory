// Purpose: Renders a card view for each vehicle in the inventory list.

import { Car, ShoppingCart, Pencil, PackagePlus, Trash2 } from "lucide-react";

const categoryStyles = {
  sedan: "bg-blue-100 text-blue-700",
  suv: "bg-amber-100 text-amber-700",
  coupe: "bg-purple-100 text-purple-700",
  hatchback: "bg-teal-100 text-teal-700",
  car: "bg-slate-100 text-slate-700",
};

function categoryClass(category) {
  return categoryStyles[category?.toLowerCase()] || "bg-slate-100 text-slate-700";
}

export default function VehicleCard({ vehicle, isAdmin, onPurchase, onEdit, onDelete, onRestock }) {
  const outOfStock = vehicle.quantity <= 0;
  const lowStock = !outOfStock && vehicle.quantity <= 2;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="h-24 bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center relative">
        <Car className="text-white/90" size={40} strokeWidth={1.5} />
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryClass(
            vehicle.category
          )}`}
        >
          {vehicle.category}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">
            ${vehicle.price.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              outOfStock ? "bg-red-500" : lowStock ? "bg-amber-500" : "bg-emerald-500"
            }`}
          />
          <p
            className={`text-sm font-medium ${
              outOfStock ? "text-red-600" : lowStock ? "text-amber-600" : "text-slate-500"
            }`}
          >
            {outOfStock ? "Out of stock" : `${vehicle.quantity} in stock`}
          </p>
        </div>
        {!isAdmin && (
        <button
          onClick={() => onPurchase(vehicle.id)}
          disabled={outOfStock}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          <ShoppingCart size={16} />
          {outOfStock ? "Unavailable" : "Purchase"}
        </button>
        )}

        {isAdmin && (
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => onEdit(vehicle)}
              title="Edit"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-slate-50 text-slate-600 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={() => onRestock(vehicle.id)}
              title="Restock"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 py-2 rounded-lg hover:bg-emerald-100 transition"
            >
              <PackagePlus size={13} /> Restock
            </button>
            <button
              onClick={() => onDelete(vehicle.id)}
              title="Delete"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-red-50 text-red-700 py-2 rounded-lg hover:bg-red-100 transition"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
