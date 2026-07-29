import { useState, useEffect } from "react";

const emptyForm = { make: "", model: "", category: "", price: "", quantity: "" };

export default function VehicleForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initial) {
      setForm({
        make: initial.make,
        model: initial.model,
        category: initial.category,
        price: initial.price,
        quantity: initial.quantity,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      make: form.make,
      model: form.model,
      category: form.category,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-3"
      >
        <h2 className="text-lg font-semibold text-slate-800">
          {initial ? "Edit Vehicle" : "Add Vehicle"}
        </h2>

        {["make", "model", "category"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">
              {field}
            </label>
            <input
              name={field}
              required
              value={form[field]}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
        ))}

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              required
              min="0"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 text-slate-700 font-medium py-2 rounded-md hover:bg-slate-200 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
