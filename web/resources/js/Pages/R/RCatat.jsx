import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    ChevronLeft,
    Plus,
    X,
    Edit3,
    Trash2,
    CheckCircle2,
    Clock,
    UserCircle,
} from "lucide-react";
import api from "../../api";
import BackButton from "../../components/lainnya/BackButton";
import { Link, useLocation } from "react-router-dom";

const TransactionToggle = ({ selectedType, onTypeChange }) => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                    onClick={() => onTypeChange("Pengeluaran")}
                    className={`relative h-16 sm:h-20 rounded-xl sm:rounded-2xl border-2 sm:border-3 transition-all duration-300 ease-in-out transform active:scale-95 hover:scale-105 ${
                        selectedType === "Pengeluaran"
                            ? "border-red-400 bg-red-50/80 shadow-lg shadow-red-200/50"
                            : "border-slate-200 bg-white/60 hover:border-red-200"
                    }`}
                >
                    <div className="flex items-center justify-center gap-2 sm:gap-3 h-full px-3 sm:px-4">
                        <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center transition-colors duration-300 ${
                                selectedType === "Pengeluaran"
                                    ? "bg-red-500"
                                    : "bg-slate-300"
                            }`}
                        >
                            <ArrowUpRight
                                className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-300 ${
                                    selectedType === "Pengeluaran"
                                        ? "text-white"
                                        : "text-slate-500"
                                }`}
                            />
                        </div>
                        <h3
                            className={`text-base sm:text-lg font-semibold transition-colors duration-300 ${
                                selectedType === "Pengeluaran"
                                    ? "text-red-600"
                                    : "text-slate-600"
                            }`}
                        >
                            Pengeluaran
                        </h3>
                    </div>
                    {selectedType === "Pengeluaran" && (
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-red-500/5 pointer-events-none"></div>
                    )}
                </button>
                <button
                    onClick={() => onTypeChange("Pemasukan")}
                    className={`relative h-16 sm:h-20 rounded-xl sm:rounded-2xl border-2 sm:border-3 transition-all duration-300 ease-in-out transform active:scale-95 hover:scale-105 ${
                        selectedType === "Pemasukan"
                            ? "border-emerald-400 bg-emerald-50/80 shadow-lg shadow-emerald-200/50"
                            : "border-slate-200 bg-white/60 hover:border-emerald-200"
                    }`}
                >
                    <div className="flex items-center justify-center gap-2 sm:gap-3 h-full px-3 sm:px-4">
                        <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center transition-colors duration-300 ${
                                selectedType === "Pemasukan"
                                    ? "bg-emerald-500"
                                    : "bg-slate-300"
                            }`}
                        >
                            <ArrowDownRight
                                className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-300 ${
                                    selectedType === "Pemasukan"
                                        ? "text-white"
                                        : "text-slate-500"
                                }`}
                            />
                        </div>
                        <h3
                            className={`text-base sm:text-lg font-semibold transition-colors duration-300 ${
                                selectedType === "Pemasukan"
                                    ? "text-emerald-600"
                                    : "text-slate-600"
                            }`}
                        >
                            Pemasukan
                        </h3>
                    </div>
                    {selectedType === "Pemasukan" && (
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-emerald-500/5 pointer-events-none"></div>
                    )}
                </button>
            </div>
        </div>
    );
};

const DraftItem = ({ draft, onEdit, onDelete }) => {
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
            .format(amount)
            .replace("IDR", "Rp");
    const meta = (t) =>
        t === "Pemasukan"
            ? {
                  grad: "from-emerald-500 to-emerald-600",
                  Icon: ArrowDownRight,
                  txt: "text-emerald-600",
              }
            : {
                  grad: "from-red-500 to-rose-600",
                  Icon: ArrowUpRight,
                  txt: "text-red-600",
              };
    const m = meta(draft.type);

    return (
        <div className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/20">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shadow-lg">
                            {draft.category?.icon || "🏷️"}
                        </div>
                        <div
                            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br ${m.grad} flex items-center justify-center shadow-md`}
                        >
                            <m.Icon className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="mb-1">
                            <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">
                                {draft.title || "Tanpa judul"}
                            </h3>
                            {draft.desc && (
                                <p className="text-slate-500 text-sm line-clamp-2">
                                    {draft.desc}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {draft.category?.name && (
                                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 shadow-sm">
                                    {draft.category.icon} {draft.category.name}
                                </span>
                            )}
                            {draft.date && (
                                <div className="flex items-center gap-1 text-slate-500 text-sm">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                        {new Date(
                                            draft.date
                                        ).toLocaleDateString("id-ID")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-right ml-4 flex flex-col items-end gap-2">
                    <div className={`font-bold text-2xl ${m.txt}`}>
                        {draft.type === "Pemasukan" ? "+" : "-"}
                        {formatCurrency(Math.abs(draft.amount))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(draft)}
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(draft.id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RCatat = () => {
    const [selectedType, setSelectedType] = useState("Pengeluaran");
    const [amount, setAmount] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState(false);
    const loc = useLocation();
    useEffect(() => {
        const initializeComponent = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                setAuthError(true);
                return;
            }
            await loadCategories();
            setTimeout(() => setIsLoading(false), 400);
        };
        initializeComponent();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await api.get("/category");
            const list = response.data?.data || response.data || [];
            setCategories(list);
            if (list.length > 0) setCategoryId(Number(list[0].id));
        } catch (error) {
            if (error?.response?.status === 401) {
                setAuthError(true);
                setCategories([]);
                setCategoryId("");
                return;
            }
            setCategories([
                { id: 1, name: "Hedon Euyy", icon: "🎉", type: "Pengeluaran" },
                {
                    id: 2,
                    name: "Bayar Sewa Kos",
                    icon: "🏠",
                    type: "Pengeluaran",
                },
                {
                    id: 3,
                    name: "Kebutuhan Rumah Tangga",
                    icon: "🛒",
                    type: "Pengeluaran",
                },
                { id: 4, name: "Gaji", icon: "💸", type: "Pemasukan" },
            ]);
            setCategoryId(1);
        }
    };

    const visibleCategories = useMemo(
        () => categories.filter((c) => c.type === selectedType),
        [categories, selectedType]
    );

    useEffect(() => {
        if (visibleCategories.length === 0) return;
        if (
            !visibleCategories.some((c) => Number(c.id) === Number(categoryId))
        ) {
            setCategoryId(Number(visibleCategories[0].id));
        }
    }, [selectedType, categories]);

    const resetForm = () => {
        setAmount("");
        setTitle("");
        setDesc("");
        setCategoryId(categories.length > 0 ? Number(categories[0].id) : "");
        setDate(new Date().toISOString().split("T")[0]);
    };

    const validateForm = () =>
        title.trim().length > 0 &&
        amount &&
        parseFloat(String(amount).replace(/[^\d]/g, "")) > 0 &&
        categoryId;

    const handleAddToDraft = () => {
        if (!validateForm()) return;
        const catObj = categories.find(
            (c) => String(c.id) === String(categoryId)
        );
        const newDraft = {
            id: Date.now(),
            type: selectedType,
            amount: parseFloat(String(amount).replace(/[^\d]/g, "")),
            title: title.trim(),
            desc: desc || "",
            category_id: categoryId,
            date,
            createdAt: new Date(),
            category: catObj
                ? { id: catObj.id, name: catObj.name, icon: catObj.icon }
                : null,
        };
        setDrafts((prev) => [...prev, newDraft]);
        resetForm();
    };

    const submitTransaction = async (transactionData) => {
        const response = await api.post("/transaction", transactionData);
        return response.data;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const allItems = [];
            if (validateForm()) {
                const finalDescription =
                    [title.trim(), desc].filter(Boolean).join(" — ") || null;
                allItems.push({
                    type: selectedType,
                    amount: parseFloat(String(amount).replace(/[^\d]/g, "")),
                    description: finalDescription,
                    category_id: categoryId,
                    date,
                });
            }
            allItems.push(
                ...drafts.map((draft) => ({
                    type: draft.type,
                    amount: draft.amount,
                    description:
                        [draft.title, draft.desc].filter(Boolean).join(" — ") ||
                        null,
                    category_id: draft.category_id,
                    date: draft.date,
                }))
            );
            if (allItems.length === 0) {
                setIsSubmitting(false);
                return;
            }
            for (const item of allItems) await submitTransaction(item);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                resetForm();
                setDrafts([]);
                setIsSubmitting(false);
            }, 1200);
        } catch (error) {
            setIsSubmitting(false);
        }
    };

    const handleEditDraft = (draft) => {
        setSelectedType(draft.type);
        setAmount(String(draft.amount));
        setTitle(draft.title || "");
        setDesc(draft.desc || "");
        setCategoryId(draft.category?.id ?? draft.category_id);
        setDate(draft.date);
        setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
    };

    const handleDeleteDraft = (draftId) =>
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));

    const formatCurrency = (value) =>
        new Intl.NumberFormat("id-ID").format(
            String(value).replace(/[^\d]/g, "")
        );

    const handleAmountChange = (e) =>
        setAmount(e.target.value.replace(/[^\d]/g, ""));

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse">
                        <Clock className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-emerald-700 font-medium">
                        Memuat Form...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 text-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-br from-emerald-200/30 to-teal-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-64 h-32 bg-gradient-to-br from-teal-200/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 relative z-10 max-w-7xl mx-auto pb-32">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                    <div className="flex items-center gap-x-2">
                        <BackButton />
                        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
                            Catat Transaksi
                        </h1>
                    </div>
                    <button className="p-2 sm:p-3 bg-white/80 text-gray-500 hover:text-emerald-500 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <UserCircle className="w-6 h-6" />
                    </button>
                </div>

                {authError && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                        Tidak dapat memuat kategori. Silakan login terlebih
                        dahulu.
                    </div>
                )}

                <div className="bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-white/20 mb-20">
                    <TransactionToggle
                        selectedType={selectedType}
                        onTypeChange={setSelectedType}
                    />

                    <div className="mt-4 sm:mt-6">
                        <div className="grid gap-3 sm:gap-4">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border-2 focus:border-emerald-500 border-transparent bg-transparent text-slate-800 focus:outline-none rounded-xl w-full sm:w-max p-2 text-sm sm:text-base"
                            />

                            <div className="relative">
                                <input
                                    type="text"
                                    value={
                                        amount
                                            ? `Rp ${formatCurrency(amount)}`
                                            : ""
                                    }
                                    onChange={handleAmountChange}
                                    className="w-full bg-gray-500/5 border-2 border-gray-200/20 focus:border-emerald-200 focus:outline-none rounded-xl rounded-t-3xl p-4 sm:p-5 text-xl sm:text-2xl font-medium text-center placeholder:text-gray-500"
                                    placeholder="Rp 10.000"
                                />
                            </div>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-500/5 border-2 border-gray-200/20 focus:border-emerald-200 focus:outline-none rounded-xl p-4 sm:p-5 text-base sm:text-lg font-medium placeholder:text-gray-500"
                                placeholder="Judul transaksi (wajib)"
                                required
                            />

                            <input
                                type="text"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className="w-full bg-gray-500/5 border-2 border-gray-200/20 focus:border-emerald-200 focus:outline-none rounded-xl p-4 sm:p-5 text-base sm:text-lg font-medium placeholder:text-gray-500"
                                placeholder="Deskripsi tambahan (opsional)"
                            />

                            <div className="w-full bg-gray-500/5 border-2 border-gray-200/20 focus:border-emerald-200 focus:outline-none rounded-xl rounded-b-3xl p-4 sm:p-5">
                                <p className="font-medium text-slate-800 mb-3 sm:mb-5 text-base sm:text-xl">
                                    Kategori
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {visibleCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() =>
                                                setCategoryId(Number(cat.id))
                                            }
                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-[1.05] ${
                                                Number(categoryId) ===
                                                Number(cat.id)
                                                    ? "bg-emerald-500/60 backdrop-blur-xl text-white border-emerald-600"
                                                    : "border-emerald-300 text-emerald-600 bg-white"
                                            }`}
                                        >
                                            <span className="text-lg">
                                                {cat.icon || "🏷️"}
                                            </span>
                                            <span>{cat.name}</span>
                                        </button>
                                    ))}
                                    <Link
                                        to="/settings/category"
                                        state={{ from: loc.pathname }}
                                        className="px-3 py-2 rounded-xl border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-100 flex items-center"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {drafts.length > 0 && (
                    <div className="bg-white/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20 mb-20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Draft ({drafts.length})
                            </h3>
                            <button
                                onClick={() => setDrafts([])}
                                className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                            >
                                <X className="w-4 h-4" />
                                Hapus Semua
                            </button>
                        </div>
                        <div className="space-y-3">
                            {drafts.map((draft) => (
                                <DraftItem
                                    key={draft.id}
                                    draft={draft}
                                    onEdit={handleEditDraft}
                                    onDelete={handleDeleteDraft}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {showSuccess && (
                    <div className="fixed top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-50 flex justify-center">
                        <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">
                                Transaksi berhasil dicatat!
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white/70 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 flex gap-3 z-50 border-t border-white/20">
                <button
                    type="button"
                    onClick={handleAddToDraft}
                    disabled={!validateForm()}
                    className={`flex-1 py-3 rounded-xl font-semibold text-base sm:text-lg shadow-sm transition ${
                        validateForm()
                            ? "bg-emerald-200 text-emerald-700 hover:bg-emerald-300"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Tambah Item
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={
                        (!validateForm() && drafts.length === 0) || isSubmitting
                    }
                    className={`flex-1 py-3 rounded-xl text-white font-semibold text-base sm:text-lg shadow-lg transition ${
                        (validateForm() || drafts.length > 0) && !isSubmitting
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    {isSubmitting ? "Menyimpan..." : "Catat Item"}
                    {drafts.length > 0 && !isSubmitting
                        ? ` (${drafts.length + (validateForm() ? 1 : 0)})`
                        : ""}
                </button>
            </div>
        </div>
    );
};

export default RCatat;
