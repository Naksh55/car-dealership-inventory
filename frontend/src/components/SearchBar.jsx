import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ onSearch, onClear }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch({ make, model, category, minPrice, maxPrice });
  }

  function handleClear() {
    setMake("");
    setModel("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    onClear();
  }

  const inputClass =
    "border border-slate-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5"
    >
      <div className="flex items-center gap-2 mb-3 text-slate-700">
        <Search size={16} />
        <h2 className="text-sm font-semibold">Search &amp; Filter</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Make</label>
          <input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Toyota" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Model</label>
          <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Camry" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Sedan" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Min Price</label>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Max Price</label>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="No limit" className={inputClass} />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Search size={14} /> Search
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-200 transition"
        >
          <X size={14} /> Clear
        </button>
      </div>
    </form>
  );
}
