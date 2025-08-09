import React, { useState, useEffect } from "react";
// Using fetch API instead of axios for compatibility
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    Clock,
    Eye,
    EyeOff,
    TrendingDown,
    TrendingUp,
    Search,
    Download,
    Plus,
    Notebook,
    BarChart3,
    ReceiptText,
    Wallet,
    RefreshCw,
    AlertCircle,
} from "lucide-react";

// API configuration using fetch
const API_BASE_URL = 'http://localhost:8000/api';

const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

const RDashboard = () => {
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [animatedBalance, setAnimatedBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // API Data State
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [dailyReport, setDailyReport] = useState(null);
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [user, setUser] = useState(null);

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Animated balance effect
    useEffect(() => {
        const timer = setInterval(() => {
            setAnimatedBalance((prev) => {
                const diff = balance - prev;
                if (Math.abs(diff) < 100) return balance;
                return prev + diff * 0.1;
            });
        }, 20);
        return () => clearInterval(timer);
    }, [balance]);

    // API Functions
        // ...existing code...

    const fetchUserProfile = async () => {
        try {
            const response = await apiCall('/profile');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchBalance = async () => {
        try {
            const response = await apiCall('/reports/balance');
            setBalance(response.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
            setError('Gagal memuat saldo');
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await apiCall('/transaction');
            const transactionsData = response.data || response;
            setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Gagal memuat transaksi');
        }
    };

    const fetchDailyReport = async () => {
        try {
            const response = await apiCall('/reports/daily');
            setDailyReport(response.data);
        } catch (error) {
            console.error('Error fetching daily report:', error);
        }
    };

    const fetchMonthlyReport = async () => {
        try {
            const response = await apiCall('/reports/monthly');
            setMonthlyReport(response.data);
        } catch (error) {
            console.error('Error fetching monthly report:', error);
        }
    };

    // ...existing code...

    const loadAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await Promise.all([
                fetchUserProfile(),
                fetchBalance(),
                fetchTransactions(),
                fetchDailyReport(),
                fetchMonthlyReport(),
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('Gagal memuat data dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        setIsRefreshing(true);
        await loadAllData();
        setIsRefreshing(false);
    };

    // Load data on component mount
    useEffect(() => {
        loadAllData();
    }, []);

    // Helper Functions
    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour >= 5 && hour < 12) return "Selamat Pagi";
        else if (hour >= 12 && hour < 15) return "Selamat Siang";
        else if (hour >= 15 && hour < 18) return "Selamat Sore";
        else if (hour >= 18 || hour < 5) return "Selamat Malam";
        else return "Halo";
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
            .format(amount)
            .replace("IDR", "Rp");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("id-ID", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Hari ini";
        if (diffDays === 1) return "Kemarin";
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return formatDate(dateString);
    };

    const getTransactionIcon = (type) => {
        return type === 'Pemasukan' ? ArrowUpRight : ArrowDownRight;
    };

    const getTransactionColor = (type) => {
        return type === 'Pemasukan'
            ? { color: "from-green-500 to-green-600", bg: "bg-green-50", text: "text-green-600" }
            : { color: "from-red-500 to-red-600", bg: "bg-red-50", text: "text-red-600" };
    };

    // Calculate stats from API data
    const totalIncome = monthlyReport?.total_income || 0;
    const totalExpense = monthlyReport?.total_expense || 0;

    const stats = [
        {
            label: "Pengeluaran",
            amount: totalExpense,
            change: 12.5, // You might want to calculate this from historical data
            trend: "up",
            icon: ArrowDownRight,
            color: "from-rose-500 to-red-600",
            bgColor: "bg-rose-50",
            textColor: "text-rose-600",
            borderColor: "border-rose-200",
        },
        {
            label: "Pemasukan",
            amount: totalIncome,
            change: 8.3, // You might want to calculate this from historical data
            trend: "up",
            icon: ArrowUpRight,
            color: "from-emerald-500 to-green-600",
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-600",
            borderColor: "border-emerald-200",
        },
    ];

    const quickActions = [
        {
            href: "/sct",
            icon: Plus,
            label: "Catat",
            desc: "Tambah transaksi",
            color: "from-blue-500 to-blue-600",
        },
        {
            href: "/sdk",
            icon: Notebook,
            label: "Daftar Kas",
            desc: "Lihat semua kas",
            color: "from-purple-500 to-purple-600",
        },
        {
            href: "/san",
            icon: BarChart3,
            label: "Analitik",
            desc: "Laporan detail",
            color: "from-orange-500 to-orange-600",
        },
        {
            href: "/split-bill",
            icon: ReceiptText,
            label: "Split Bill",
            desc: "Bagi tagihan",
            color: "from-pink-500 to-pink-600",
        },
    ];

    const filteredTransactions = transactions.filter((tx) => {
        const matchesSearch =
            tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.type?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        switch (selectedFilter) {
            case "income":
                return tx.type === 'Pemasukan';
            case "expense":
                return tx.type === 'Pengeluaran';
            default:
                return true;
        }
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse">
                        <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-emerald-700 font-medium">
                        Memuat dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <div className="text-center max-w-md p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-red-700 font-medium mb-4">{error}</p>
                    <button
                        onClick={refreshData}
                        className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 text-slate-800 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-teal-200/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg ring-4 ring-white/20">
                            👤
                        </div>
                        <div>
                            <h1 className="font-bold text-2xl sm:text-3xl text-slate-800">
                                {getGreeting()}, {user?.name || 'User'}!
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">
                                {currentTime.toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}{" "}
                                -{" "}
                                {currentTime.toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={refreshData}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Memperbarui...' : 'Refresh'}
                    </button>
                </div>

                {/* Balance Section */}
                <div className="mb-8">
                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-lg border border-white/20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-lg sm:text-2xl font-semibold text-slate-700">
                                            Total Saldo
                                        </h2>
                                        <button
                                            onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            {isBalanceHidden ? (
                                                <EyeOff className="w-5 h-5 text-slate-500" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-slate-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-4 mb-2">
                                    <h1
                                        className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent transition-all duration-300 ${
                                            isBalanceHidden ? "blur-lg" : ""
                                        }`}
                                    >
                                        {formatCurrency(animatedBalance)}
                                    </h1>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-600">
                                            +5.2%
                                        </span>
                                    </div>
                                    <p className="text-slate-600">
                                        Dibandingkan bulan lalu
                                    </p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div
                                            key={stat.label}
                                            className={`bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${stat.borderColor} group`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div
                                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                                >
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${stat.bgColor} ${stat.textColor} flex items-center gap-1.5 shadow-sm`}
                                                >
                                                    {stat.trend === "up" ? (
                                                        <TrendingUp className="w-3 h-3" />
                                                    ) : (
                                                        <TrendingDown className="w-3 h-3" />
                                                    )}
                                                    {stat.change}%
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-bold text-slate-800">
                                                    {formatCurrency(stat.amount)}
                                                </h3>
                                                <p className="text-sm font-medium text-slate-600">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        Aksi Cepat
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action) => (
                            <a
                                key={action.label}
                                href={action.href}
                                className="group flex flex-col items-center p-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-sm text-slate-800 mb-1">
                                    {action.label}
                                </h3>
                                <p className="text-xs text-slate-500 text-center">
                                    {action.desc}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Transactions Section */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-emerald-600" />
                            Transaksi Terbaru ({transactions.length})
                        </h2>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto p-3">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((tx, index) => {
                                const IconComponent = getTransactionIcon(tx.type);
                                const colors = getTransactionColor(tx.type);

                                return (
                                    <div
                                        key={tx.id}
                                        className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/20 cursor-pointer"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                        onClick={() =>
                                            setSelectedTransaction(
                                                selectedTransaction?.id === tx.id ? null : tx
                                            )
                                        }
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shadow-lg">
                                                        {tx.type === 'Pemasukan' ? '💰' : '💳'}
                                                    </div>
                                                    <div
                                                        className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br ${colors.color} flex items-center justify-center shadow-md`}
                                                    >
                                                        <IconComponent className="w-3 h-3 text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="font-bold text-slate-800 text-lg leading-tight">
                                                            {tx.description || `${tx.type} - ${tx.category?.name || 'Umum'}`}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span
                                                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${colors.bg} ${colors.text}`}
                                                        >
                                                            {tx.category?.name || tx.type}
                                                        </span>
                                                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                                                            <Clock className="w-3 h-3" />
                                                            <span>
                                                                {getTimeAgo(tx.date)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                                                            <span>
                                                                {formatTime(tx.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        {formatDate(tx.date)} - {tx.description || 'Transaksi ' + tx.type}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div
                                                    className={`font-bold text-xl mb-1 ${
                                                        tx.type === 'Pemasukan'
                                                            ? "text-emerald-600"
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {tx.type === 'Pemasukan' ? "+" : "-"}
                                                    {formatCurrency(tx.amount)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                    <Activity className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-slate-500 text-lg font-medium">
                                    Belum ada transaksi
                                </p>
                                <p className="text-slate-400 text-sm mt-1">
                                    Mulai catat transaksi pertama Anda
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RDashboard;
