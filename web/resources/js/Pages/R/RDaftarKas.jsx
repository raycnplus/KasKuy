import React, { useState, useEffect } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    ChevronLeft,
    Clock,
    UserCircle,
    Search,
    Activity,
    Eye,
    EyeOff,
    Calendar,
} from "lucide-react";

const RDaftarKas = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const transactions = [
        {
            id: 1,
            emoji: "🎉",
            title: "Perpisahan muncak bareng temen",
            type: "Pengeluaran",
            tanggal: "30 Juli 2025",
            waktu: "19:30",
            deskripsi: "sewa villa dan barbeque-an sama anak kelas",
            nominal: -900000,
            saldo: 15750000,
            status: "completed",
            kategori: "Hiburan",
            favorite: false,
        },
        {
            id: 2,
            emoji: "🍽️",
            title: "Fine Dining di The Garden Osteria",
            type: "Pengeluaran",
            tanggal: "29 Juli 2025",
            waktu: "20:15",
            deskripsi: "Self Rewards - anniversary dinner",
            nominal: -3500000,
            saldo: 16650000,
            status: "completed",
            kategori: "Makanan",
            favorite: true,
        },
        {
            id: 3,
            emoji: "💰",
            title: "Gaji Bulanan",
            type: "Pemasukan",
            tanggal: "28 Juli 2025",
            waktu: "09:00",
            deskripsi: "Gaji bulan Juli 2025 - Alhamdulillah!",
            nominal: 5500000,
            saldo: 20150000,
            status: "completed",
            kategori: "Gaji",
            favorite: false,
        },
        {
            id: 4,
            emoji: "⛽",
            title: "Isi Bensin Motor",
            type: "Pengeluaran",
            tanggal: "27 Juli 2025",
            waktu: "08:45",
            deskripsi: "Pertamax Turbo - Shell SPBU Sudirman",
            nominal: -85000,
            saldo: 14650000,
            status: "completed",
            kategori: "Transportasi",
            location: "Shell SPBU Sudirman",
            favorite: false,
        },
        {
            id: 5,
            emoji: "🛒",
            title: "Belanja Bulanan",
            type: "Pengeluaran",
            tanggal: "26 Juli 2025",
            waktu: "16:20",
            deskripsi: "Groceries di Superindo - stock makanan",
            nominal: -750000,
            saldo: 14735000,
            status: "completed",
            kategori: "Belanja",
            favorite: false,
        },
        {
            id: 6,
            emoji: "💸",
            title: "Transfer ke Adek",
            type: "Pengeluaran",
            tanggal: "25 Juli 2025",
            waktu: "14:30",
            deskripsi: "Uang jajan bulanan untuk adek kuliah",
            nominal: -2000000,
            saldo: 15485000,
            status: "completed",
            kategori: "Transfer",
            favorite: false,
        },
        {
            id: 7,
            emoji: "📱",
            title: "Bayar Paket Internet",
            type: "Pengeluaran",
            tanggal: "24 Juli 2025",
            waktu: "10:15",
            deskripsi: "Paket unlimited Telkomsel",
            nominal: -150000,
            saldo: 17485000,
            status: "completed",
            kategori: "Tagihan",
            favorite: false,
        },
        {
            id: 8,
            emoji: "☕",
            title: "Nongkrong di Kafe",
            type: "Pengeluaran",
            tanggal: "23 Juli 2025",
            waktu: "15:45",
            deskripsi: "Kopi sama temen di Starbucks",
            nominal: -275000,
            saldo: 17635000,
            status: "completed",
            kategori: "Makanan",
            favorite: false,
        },
        {
            id: 9,
            emoji: "🏠",
            title: "Bayar Sewa Kos",
            type: "Pengeluaran",
            tanggal: "1 Juni 2025",
            waktu: "10:00",
            deskripsi: "Sewa kos bulan Juni 2025",
            nominal: -1500000,
            saldo: 16135000,
            status: "completed",
            kategori: "Tempat Tinggal",
            favorite: false,
        },
        {
            id: 10,
            emoji: "🎓",
            title: "Bonus Proyek",
            type: "Pemasukan",
            tanggal: "15 Mei 2025",
            waktu: "14:30",
            deskripsi: "Bonus penyelesaian proyek Q1",
            nominal: 2500000,
            saldo: 17635000,
            status: "completed",
            kategori: "Bonus",
            favorite: false,
        },
    ];

    const parseIndonesianDate = (dateStr) => {
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];
        const [day, monthName, year] = dateStr.split(" ");
        const monthIndex = months.indexOf(monthName);
        return new Date(parseInt(year), monthIndex, parseInt(day));
    };

    const filterByDate = (transactions, dateFilter) => {
        if (dateFilter === "all") return transactions;
        const now = new Date();
        const daysAgo = dateFilter === "30" ? 30 : 90;
        const filterDate = new Date();
        filterDate.setDate(now.getDate() - daysAgo);
        return transactions.filter((tx) => {
            const txDate = parseIndonesianDate(tx.tanggal);
            return txDate >= filterDate;
        });
    };

    const dateFilteredTransactions = filterByDate(transactions, dateFilter);

    const totalIncome = dateFilteredTransactions
        .filter((tx) => tx.nominal > 0)
        .reduce((sum, tx) => sum + tx.nominal, 0);
    const totalExpense = dateFilteredTransactions
        .filter((tx) => tx.nominal < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.nominal), 0);
    const balance = totalIncome - totalExpense;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(loadingTimer);
    }, []);

    const TransactionIcons = {
        Pemasukan: {
            icon: ArrowDownRight,
            color: "from-green-500 to-green-600",
            bg: "bg-green-50",
        },
        Pengeluaran: {
            icon: ArrowUpRight,
            color: "from-red-500 to-red-600",
            bg: "bg-red-50",
        },
    };

    const options = [
        { value: "all", label: "Semua" },
        { value: "30", label: "30 Hari" },
        { value: "90", label: "90 Hari" },
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
            .format(amount)
            .replace("IDR", "Rp");
    };

    const getTimeAgo = (dateStr) => {
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];
        const [day, monthName] = dateStr.split(" ");
        const monthIndex = months.indexOf(monthName);
        const year = 2025;
        const date = new Date(year, monthIndex, day);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) return "Kemarin";
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return dateStr;
    };

    const [isLeft, setIsLeft] = useState(true);

    const togglePosition = () => {
        setIsLeft(!isLeft);
    };

    const filteredTransactions = dateFilteredTransactions
        .filter((tx) => {
            const matchesSearch =
                tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tx.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tx.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSearch) return false;
            switch (selectedFilter) {
                case "income":
                    return tx.nominal > 0;
                case "expense":
                    return tx.nominal < 0;
                case "favorites":
                    return tx.favorite;
                default:
                    return true;
            }
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return (
                        parseIndonesianDate(a.tanggal) -
                        parseIndonesianDate(b.tanggal)
                    );
                case "highest":
                    return Math.abs(b.nominal) - Math.abs(a.nominal);
                case "lowest":
                    return Math.abs(a.nominal) - Math.abs(b.nominal);
                default:
                    return (
                        parseIndonesianDate(b.tanggal) -
                        parseIndonesianDate(a.tanggal)
                    );
            }
        });

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-emerald-700 font-medium">
                        Memuat Daftar Kas...
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
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-br from-teal-200/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 relative z-10 max-w-7xl mx-auto pb-32">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                    <div className="flex items-center gap-x-2">
                        <a href="/dashboard">
                            <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500 hover:text-emerald-600 cursor-pointer transition-colors" />
                        </a>
                        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
                            Daftar Kas
                        </h1>
                    </div>
                    <button className="p-2 sm:p-3 bg-white/80 text-gray-500 hover:text-emerald-500 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <UserCircle className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex justify-end">
                    <div className="relative inline-flex bg-white/60 rounded-xl p-1 shadow-inner mb-6">
                        <div
                            className={`absolute top-1 left-1 w-1/3 h-[calc(100%-0.5rem)] bg-emerald-500 rounded-xl transition-all duration-300 ease-in-out shadow-lg`}
                            style={{
                                transform: `translateX(${
                                    options.findIndex(
                                        (opt) => opt.value === dateFilter
                                    ) * 100
                                }%)`,
                            }}
                        ></div>
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setDateFilter(option.value)}
                                className={`relative z-10 w-28 text-sm font-medium py-2 px-4 rounded-xl transition-all duration-300 ${
                                    dateFilter === option.value
                                        ? "text-white"
                                        : "text-slate-700"
                                } flex items-center justify-center gap-2`}
                            >
                                <Calendar className="w-4 h-4" />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-700">
                                Total Saldo
                                {dateFilter !== "all" && (
                                    <span className="text-sm font-normal text-slate-500 block">
                                        ({dateFilter} hari terakhir)
                                    </span>
                                )}
                            </h3>
                            <button
                                onClick={() =>
                                    setIsBalanceHidden(!isBalanceHidden)
                                }
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                {isBalanceHidden ? (
                                    <EyeOff className="w-5 h-5 text-slate-500" />
                                ) : (
                                    <Eye className="w-5 h-5 text-slate-500" />
                                )}
                            </button>
                        </div>
                        <div
                            className={`text-2xl font-bold ${
                                balance >= 0
                                    ? "text-emerald-600"
                                    : "text-red-600"
                            } ${isBalanceHidden ? "blur-lg" : ""}`}
                        >
                            {formatCurrency(balance)}
                        </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                                <ArrowDownRight className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">
                                Pemasukan
                            </h3>
                        </div>
                        <div className="text-2xl font-bold text-emerald-600">
                            {formatCurrency(totalIncome)}
                        </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">
                                Pengeluaran
                            </h3>
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(totalExpense)}
                        </div>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <input
                                className="w-full rounded-xl p-3 pl-4 pr-12 bg-white/80 backdrop-blur-md placeholder:text-gray-400 font-medium border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Cari transaksi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                        <div className="relative min-w-0 lg:w-48">
                            <select
                                className="w-full rounded-xl p-3 pl-4 pr-8 bg-white/80 backdrop-blur-md text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-white/20"
                                value={selectedFilter}
                                onChange={(e) =>
                                    setSelectedFilter(e.target.value)
                                }
                            >
                                <option value="all">Semua Kategori</option>
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                &#9662;
                            </span>
                        </div>
                        <div className="relative min-w-0 lg:w-48">
                            <select
                                className="w-full rounded-xl p-3 pl-4 pr-8 bg-white/80 backdrop-blur-md text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-white/20"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Terbaru</option>
                                <option value="oldest">Terlama</option>
                                <option value="highest">
                                    Nominal Tertinggi
                                </option>
                                <option value="lowest">Nominal Terendah</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                &#9662;
                            </span>
                        </div>
                    </div>
                </div>
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-emerald-600" />
                            Transaksi
                            <span className="text-slate-800">
                                ({filteredTransactions.length})
                            </span>
                        </h2>
                    </div>
                    <div className="space-y-4 max-h-[800px] overflow-y-auto p-5">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((tx, index) => {
                                const transactionType =
                                    TransactionIcons[tx.type];
                                const IconComponent =
                                    transactionType?.icon || Activity;
                                const iconColor =
                                    transactionType?.color ||
                                    "from-slate-500 to-slate-600";
                                const badgeBg =
                                    transactionType?.bg || "bg-slate-50";
                                return (
                                    <div
                                        key={tx.id}
                                        className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/20 cursor-pointer"
                                        style={{
                                            animationDelay: `${index * 50}ms`,
                                        }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shadow-lg">
                                                        {tx.emoji}
                                                    </div>
                                                    <div
                                                        className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-md`}
                                                    >
                                                        <IconComponent className="w-3 h-3 text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="font-bold text-slate-800 text-lg leading-tight">
                                                            {tx.title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span
                                                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${badgeBg} text-slate-700 shadow-sm`}
                                                        >
                                                            {tx.kategori}
                                                        </span>
                                                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                                                            <Clock className="w-3 h-3" />
                                                            <span>
                                                                {getTimeAgo(
                                                                    tx.tanggal
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                                                            <span>
                                                                {tx.waktu}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        {tx.deskripsi}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div
                                                    className={`font-bold text-2xl mb-1 ${
                                                        tx.nominal > 0
                                                            ? "text-emerald-600"
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {tx.nominal > 0 ? "+" : ""}
                                                    {formatCurrency(
                                                        Math.abs(tx.nominal)
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                    <Calendar className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-slate-500 text-lg font-medium mb-2">
                                    Tidak ada transaksi ditemukan
                                </p>
                                <p className="text-slate-400 text-sm">
                                    {dateFilter !== "all"
                                        ? `Tidak ada transaksi dalam ${dateFilter} hari terakhir`
                                        : "Coba ubah kata kunci pencarian atau filter"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RDaftarKas;
