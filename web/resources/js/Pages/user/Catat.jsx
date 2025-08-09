import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import ToggleButton from "../../components/lainnya/ToggleButton";
import gsap from "gsap";
import InputRupiah from "../../components/lainnya/InputRupiah";

const categories = [
    { emoji: "🤑", label: "Hedon Euyy" },
    { emoji: "🏠", label: "Bayar Sewa Kos" },
    { emoji: "🧽", label: "Kebutuhan Rumah Tangga" },
];

const Catat = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.from(containerRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out",
        });
    }, []);

    const toggleCategory = (label) => {
        setSelectedCategories((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label]
        );
    };

    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 text-pink-500 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-pink-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-300/20 rounded-full blur-3xl" />
            </div>

            <div className="p-7" ref={containerRef}>
                <div className="flex items-center gap-x-2">
                    <a href="/dashboard">
                        <ChevronLeft className="w-8 h-8 text-pink-500 hover:text-pink-700 cursor-pointer" />
                    </a>
                    <h1 className="text-2xl font-semibold">Catat Transaksi</h1>
                </div>

                <div className="mt-6">
                    <ToggleButton />
                </div>

                <form className="mt-6 space-y-4">
                    <InputRupiah />

                    <input
                        type="text"
                        placeholder="Tambah keterangan transaksi..."
                        className="bg-white w-full h-[60px] rounded-xl text-base font-medium px-4 placeholder-gray-400 shadow-sm focus:outline-pink-400"
                    />

                    <div className="bg-white rounded-xl rounded-b-3xl px-4 py-3 space-y-3">
                        <p className="font-medium text-pink-600">Kategori</p>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.label}
                                    type="button"
                                    onClick={() => toggleCategory(cat.label)}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 hover:scale-[1.05] ${
                                        selectedCategories.includes(cat.label)
                                            ? "bg-pink-500 text-white border-pink-600"
                                            : "border-pink-300 text-pink-600 bg-white"
                                    }`}
                                >
                                    <span>{cat.emoji}</span>
                                    {cat.label}
                                </button>
                            ))}
                            <button
                                type="button"
                                className="px-3 py-2 rounded-xl border-2 border-pink-300 text-pink-600 hover:bg-pink-100 flex items-center"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Bottom actions */}
            <div className="fixed bottom-0 left-0 w-full bg-white/70 backdrop-blur-md px-6 py-4 flex gap-3 z-50">
                <button
                    type="button"
                    className="flex-1 py-3 rounded-xl bg-pink-200 text-pink-700 font-semibold text-lg shadow-sm hover:bg-pink-300 transition"
                >
                    Tambah Item
                </button>
                <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white font-semibold text-lg shadow-lg hover:from-pink-600 hover:to-pink-700 transition"
                >
                    Catat Item
                </button>
            </div>
        </div>
    );
};

export default Catat;
