export default function VehicleCard({ vehicle, isAdmin, onPurchase, onEdit, onDelete, onRestock }) {
  const outOfStock = vehicle.quantity <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-3">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-slate-800">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="text-xs uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            {vehicle.category}
          </span>
        </div>
        <p className="text-2xl font-bold text-indigo-600 mt-1">
          ${vehicle.price.toLocaleString()}
        </p>
        <p className={`text-sm mt-1 ${outOfStock ? "text-red-500" : "text-slate-500"}`}>
          {outOfStock ? "Out of stock" : `${vehicle.quantity} in stock`}
        </p>
      </div>

      <button
        onClick={() => onPurchase(vehicle.id)}
        disabled={outOfStock}
        className="w-full bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {outOfStock ? "Unavailable" : "Purchase"}
      </button>

      {isAdmin && (
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onEdit(vehicle)}
            className="flex-1 text-sm bg-slate-100 text-slate-700 py-1.5 rounded-md hover:bg-slate-200 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onRestock(vehicle.id)}
            className="flex-1 text-sm bg-emerald-50 text-emerald-700 py-1.5 rounded-md hover:bg-emerald-100 transition"
          >
            Restock
          </button>
          <button
            onClick={() => onDelete(vehicle.id)}
            className="flex-1 text-sm bg-red-50 text-red-700 py-1.5 rounded-md hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
