import { useState, useEffect } from "react";
import { useCategories, PRESET_COLORS } from "../context/CategoryContext";

const inputCls =
  "w-full bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-gray-300";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function CategoryModal({ isOpen, onClose, onSave, initialData = null, defaultType = "expense" }) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [type, setType] = useState(initialData?.type ?? defaultType);
  const [color, setColor] = useState(initialData?.color ?? PRESET_COLORS[0]);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? "");
      setType(initialData?.type ?? defaultType);
      setColor(initialData?.color ?? PRESET_COLORS[0]);
    }
  }, [isOpen, initialData, defaultType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Name cannot be empty');
      return;
    }
    const payload = initialData
      ? { name: name.trim(), color }
      : { name: name.trim(), type, color };
    onSave(payload);
    if (!initialData) {
      setName("");
      setType(defaultType);
      setColor(PRESET_COLORS[0]);
    }
    onClose();
  };

  const handleClose = () => {
    setName(initialData?.name ?? "");
    setType(initialData?.type ?? "expense");
    setColor(initialData?.color ?? PRESET_COLORS[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-purple-100 p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {initialData ? "Edit Category" : "Add New Category"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Office Supplies"
              className={inputCls}
              required
              autoFocus
            />
          </Field>
          {!initialData && (
            <Field label="Type">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={type === "expense"}
                    onChange={(e) => setType(e.target.value)}
                    className="text-purple-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Expense</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={type === "income"}
                    onChange={(e) => setType(e.target.value)}
                    className="text-purple-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Income</span>
                </label>
              </div>
            </Field>
          )}
          <Field label="Color">
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === c ? "border-gray-800 scale-110" : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </Field>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border-2 border-purple-200 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-200 transition-all text-sm"
            >
              {initialData ? "Save" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CategoryRow({ category, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(category.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-purple-50/50 transition-colors group">
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <span className="text-sm font-medium text-gray-800">{category.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(category)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-100 transition-colors"
          title="Edit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={handleDeleteClick}
          className={`p-1.5 rounded-lg transition-colors ${
            confirmDelete
              ? "text-rose-600 bg-rose-100"
              : "text-gray-500 hover:text-rose-600 hover:bg-rose-50"
          }`}
          title={confirmDelete ? "Click again to confirm" : "Delete"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function SettingsCategories() {
  const {
    expenseCategories,
    incomeCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [activeTab, setActiveTab] = useState("expense");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const categories = activeTab === "expense" ? expenseCategories : incomeCategories;

  const handleAddCategory = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleSaveCategory = (data) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
    } else {
      addCategory(data);
    }
    setEditingCategory(null);
    setModalOpen(false);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Category Management
          </span>
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage your expense and income categories. These appear in transactions and budgets.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4 border-b border-purple-50">
          {[
            { id: "expense", label: "Expense Categories", count: expenseCategories.length },
            { id: "income", label: "Income Categories", count: incomeCategories.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-t-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow"
                  : "text-gray-400 hover:text-purple-600"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-purple-50 text-purple-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Category list */}
        <div className="p-4">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📂</div>
              <p className="text-sm">
                No {activeTab} categories yet. Add one below!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-purple-50">
              {categories.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  onEdit={handleEditCategory}
                  onDelete={deleteCategory}
                />
              ))}
            </div>
          )}

          {/* Add New Category button */}
          <button
            onClick={handleAddCategory}
            className="w-full mt-4 py-3 border-2 border-dashed border-purple-200 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all text-sm flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span> Add New Category
          </button>
        </div>
      </div>

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        initialData={editingCategory}
        defaultType={activeTab}
      />
    </>
  );
}
