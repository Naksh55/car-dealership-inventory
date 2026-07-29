import { useState } from "react";

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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap gap-3 items-end"
    >
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Make</label>
        <input
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="border border-slate-300 rounded-md px-2 py-1.5 text-sm w-28"
          placeholder="Toyota"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Model</label>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border border-slate-300 rounded-md px-2 py-1.5 text-sm w-28"
          placeholder="Camry"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-300 rounded-md px-2 py-1.5 text-sm w-28"
          placeholder="Sedan"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Min Price</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border border-slate-300 rounded-md px-2 py-1.5 text-sm w-24"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Max Price</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-slate-300 rounded-md px-2 py-1.5 text-sm w-24"
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white text-sm font-medium px-4 py-1.5 rounded-md hover:bg-indigo-700 transition"
      >
        Search
      </button>
      <button
        type="button"
        onClick={handleClear}
        className="bg-slate-100 text-slate-600 text-sm font-medium px-4 py-1.5 rounded-md hover:bg-slate-200 transition"
      >
        Clear
      </button>
    </form>
  );
}
