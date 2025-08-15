import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Plus, Edit3, Trash2, X, CheckCircle2, Smile } from "lucide-react";
import Emoji from "../../components/Emoji";
import api from "../../api";
import BackButton from "../../components/lainnya/BackButton";
import { useNavigate, useLocation } from "react-router-dom";

const typeActiveClasses = {
  Pengeluaran: {
    wrapper: "border-red-400 bg-red-50/80 shadow-lg shadow-red-200/50",
    dot: "bg-red-500",
    text: "text-red-600",
    ring: "ring-red-200 hover:ring-red-300",
  },
  Pemasukan: {
    wrapper: "border-emerald-400 bg-emerald-50/80 shadow-lg shadow-emerald-200/50",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    ring: "ring-emerald-200 hover:ring-emerald-300",
  },
};

const TypeToggle = ({ value, onChange }) => {
  const options = ["Pengeluaran", "Pemasukan"];
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {options.map((opt) => {
          const active = value === opt;
          const cls = typeActiveClasses[opt];
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`relative h-14 sm:h-16 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ease-in-out transform active:scale-95 hover:scale-105 ${
                active ? cls.wrapper : "border-slate-200 bg-white/60 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-center gap-2 h-full px-4">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center transition-colors duration-300 ${active ? cls.dot : "bg-slate-300"}`} />
                <h3 className={`text-base sm:text-lg font-semibold transition-colors duration-300 ${active ? cls.text : "text-slate-600"}`}>{opt}</h3>
              </div>
              {active && <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-black/0 pointer-events-none" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const priorities = [
  { key: "Low", bg: "bg-slate-500", border: "border-slate-600", idleBorder: "border-slate-200", idleText: "text-slate-700" },
  { key: "Medium", bg: "bg-amber-500", border: "border-amber-600", idleBorder: "border-amber-200", idleText: "text-amber-700" },
  { key: "High", bg: "bg-rose-500", border: "border-rose-600", idleBorder: "border-rose-200", idleText: "text-rose-700" },
];

const PrioritySelect = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {priorities.map((p) => {
        const active = value === p.key;
        return (
          <button
            key={p.key}
            type="button"
            onClick={() => onChange(p.key)}
            className={`px-3 py-1.5 rounded-xl border-2 text-sm font-medium transition-all hover:scale-[1.03] ${active ? `text-white ${p.bg} ${p.border}` : `${p.idleBorder} ${p.idleText} bg-white`}`}
          >
            {p.key}
          </button>
        );
      })}
    </div>
  );
};

const CategoryCard = ({ cat, onEdit, onDelete }) => {
  const badge = cat.priority === "High" ? "bg-rose-100 text-rose-700 border-rose-200" : cat.priority === "Medium" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-200";
  const ring = cat.type === "Pemasukan" ? "ring-emerald-200 hover:ring-emerald-300" : "ring-red-200 hover:ring-red-300";
  const icon = cat.icon || "💠";
  return (
    <div className={`group bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-sm ring-2 ${ring} transition`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-2xl sm:text-3xl">{icon}</div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-800 truncate">{cat.name}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-lg border ${badge}`}>{cat.priority}</span>
            </div>
            <p className="text-xs text-slate-500">{cat.type}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-80">
          <button onClick={() => onEdit(cat)} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(cat)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ open, onClose, title, children, onSubmit, submitText, disabled }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-white/40">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
        <div className="p-4 border-t border-white/40 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Batal</button>
          <button onClick={onSubmit} disabled={disabled} className={`flex-1 py-2.5 rounded-xl text-white font-semibold shadow-lg transition ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"}`}>{submitText}</button>
        </div>
      </div>
    </div>
  );
};

const RCategory = () => {
  const [categories, setCategories] = useState([]);
  const [filterType, setFilterType] = useState("Pengeluaran");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🧩");
  const [type, setType] = useState("Pengeluaran");
  const [priority, setPriority] = useState("Low");
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const RCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  }

  const goBack = () => {
    if (from) navigate(from, { replace: true });
    else if (window.history.length > 1) navigate(-1);
    else navigate("/dashboard");
  };

  const filtered = useMemo(() => categories.filter((c) => c.type === filterType), [categories, filterType]);

  const resetForm = () => {
    setCurrentId(null);
    setName("");
    setIcon("🧩");
    setType("Pengeluaran");
    setPriority("Low");
    setShowEmoji(false);
  };

  const openCreate = () => {
    setMode("create");
    resetForm();
    setOpen(true);
  };

  const openEdit = (cat) => {
    setMode("edit");
    setCurrentId(cat.id);
    setName(cat.name);
    setIcon(cat.icon || "🧩");
    setType(cat.type);
    setPriority(cat.priority || "Low");
    setOpen(true);
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/category");
      setCategories(res.data?.data || res.data || []);
    } catch {
      setToast({ type: "error", text: "Gagal memuat kategori." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const valid = name.trim() && ["Pemasukan", "Pengeluaran"].includes(type) && ["Low", "Medium", "High"].includes(priority);

  const handleSubmit = async () => {
    if (!valid) return;
    setSaving(true);
    try {
      if (mode === "create") {
        const res = await api.post("/category", { name, icon, type, priority });
        const payload = res.data?.data || res.data;
        setCategories((prev) => [payload, ...prev]);
        setToast({ type: "success", text: "Kategori ditambahkan!" });
      } else {
        const res = await api.put(`/category/${currentId}`, { name, icon, type, priority });
        const payload = res.data?.data || res.data;
        setCategories((prev) => prev.map((c) => (c.id === currentId ? payload : c)));
        setToast({ type: "success", text: "Kategori diperbarui!" });
      }
      setOpen(false);
      resetForm();
    } catch {
      setToast({ type: "error", text: "Operasi gagal. Coba lagi." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    const ok = confirm(`Hapus kategori "${cat.name}"?`);
    if (!ok) return;
    try {
      await api.delete(`/category/${cat.id}`);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setToast({ type: "success", text: "Kategori dihapus." });
    } catch {
      setToast({ type: "error", text: "Gagal menghapus kategori." });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 text-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-br from-emerald-200/30 to-teal-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-br from-teal-200/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="p-4 sm:p-6 lg:p-8 relative z-10 max-w-5xl mx-auto pb-28">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-x-2">
            <BackButton />
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Kelola Kategori</h1>
          </div>

          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm transition">
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20 mb-6">
          <TypeToggle value={filterType} onChange={setFilterType} />
        </div>

        {loading ? (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-sm">
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-slate-200/70 rounded w-1/3" />
              <div className="grid sm:grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-slate-200/60 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} onEdit={openEdit} onDelete={handleDelete} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-center text-slate-600">
                Belum ada kategori {filterType.toLowerCase()}. Klik <span className="font-semibold text-emerald-700">Tambah</span> untuk membuat.
              </div>
            )}
          </div>
        )}

        {toast && (
          <div className="fixed top-4 left-4 right-4 sm:top-6 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-50 flex justify-center">
            <div className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">{toast.text}</span>
              <button onClick={() => setToast(null)} className="ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={mode === "create" ? "Tambah Kategori" : "Edit Kategori"}
        onSubmit={handleSubmit}
        submitText={mode === "create" ? "Simpan" : "Update"}
        disabled={!valid || saving}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-[56px,1fr] gap-3 items-center">
            <button type="button" onClick={() => setShowEmoji((s) => !s)} className="w-14 h-14 rounded-2xl border-2 border-emerald-200 bg-white hover:bg-emerald-50 flex items-center justify-center text-3xl" title="Pilih Emoji">
              {icon || "🧩"}
            </button>
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kategori</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Makan, Gaji, Sewa Kos" className="w-full bg-gray-500/5 border-2 border-gray-200/50 focus:border-emerald-300 focus:outline-none rounded-xl p-3 text-base" />
              <Emoji open={showEmoji} onSelect={(unicode) => { setIcon(unicode); setShowEmoji(false); }} onClose={() => setShowEmoji(false)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipe</label>
            <TypeToggle value={type} onChange={setType} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Prioritas</label>
            <PrioritySelect value={priority} onChange={setPriority} />
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Smile className="w-4 h-4" />
            <span>Pakai emoji buat icon kategori biar cepat dikenali.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RCategory;
