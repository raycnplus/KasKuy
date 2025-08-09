import React, { useState, useEffect } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    ChevronLeft,
    Activity,
    TrendingUp,
    TrendingDown,
    PieChart,
    BarChart3,
    Calendar,
    Target,
    Award,
    AlertCircle,
} from "lucide-react";
import { PieChart as RechartsPieChart, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

const RAnalitik = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState("30");
    const [chartType, setChartType] = useState("pie");

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
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember",
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

    const filteredTransactions = filterByDate(transactions, selectedPeriod);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
            .format(amount)
            .replace("IDR", "Rp");
    };

    const totalIncome = filteredTransactions
        .filter((tx) => tx.nominal > 0)
        .reduce((sum, tx) => sum + tx.nominal, 0);
    const totalExpense = filteredTransactions
        .filter((tx) => tx.nominal < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.nominal), 0);
    const balance = totalIncome - totalExpense;

    const categoryData = filteredTransactions
        .filter(tx => tx.nominal < 0)
        .reduce((acc, tx) => {
            const category = tx.kategori;
            if (!acc[category]) {
                acc[category] = { total: 0, count: 0, emoji: tx.emoji };
            }
            acc[category].total += Math.abs(tx.nominal);
            acc[category].count += 1;
            return acc;
        }, {});

    const categoryChartData = Object.entries(categoryData).map(([category, data]) => ({
        name: category,
        value: data.total,
        count: data.count,
        emoji: data.emoji,
        percentage: ((data.total / totalExpense) * 100).toFixed(1)
    })).sort((a, b) => b.value - a.value);

    const monthlyData = filteredTransactions.reduce((acc, tx) => {
        const date = parseIndonesianDate(tx.tanggal);
        const monthKey = date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
        if (!acc[monthKey]) {
            acc[monthKey] = { month: monthKey, income: 0, expense: 0, net: 0 };
        }
        if (tx.nominal > 0) {
            acc[monthKey].income += tx.nominal;
        } else {
            acc[monthKey].expense += Math.abs(tx.nominal);
        }
        acc[monthKey].net = acc[monthKey].income - acc[monthKey].expense;
        return acc;
    }, {});

    const trendData = Object.values(monthlyData).sort((a, b) =>
        new Date(a.month) - new Date(b.month)
    );

    const dailySpending = filteredTransactions
        .filter(tx => tx.nominal < 0)
        .reduce((acc, tx) => {
            const date = parseIndonesianDate(tx.tanggal);
            const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });
            if (!acc[dayName]) acc[dayName] = 0;
            acc[dayName] += Math.abs(tx.nominal);
            return acc;
        }, {});

    const dailyChartData = Object.entries(dailySpending).map(([day, amount]) => ({
        day,
        amount,
        average: amount / (filteredTransactions.filter(tx =>
            parseIndonesianDate(tx.tanggal).toLocaleDateString('id-ID', { weekday: 'long' }) === day
        ).length || 1)
    }));

    const COLORS = [
        '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#f97316', '#84cc16', '#ec4899'
    ];

    const averageDailyExpense = totalExpense / (selectedPeriod === "30" ? 30 : 90);
    const largestExpense = Math.max(...filteredTransactions.filter(tx => tx.nominal < 0).map(tx => Math.abs(tx.nominal)));
    const expenseTransactions = filteredTransactions.filter(tx => tx.nominal < 0).length;
    const incomeTransactions = filteredTransactions.filter(tx => tx.nominal > 0).length;

    const periodOptions = [
        { value: "all", label: "Semua" },
        { value: "30", label: "30 Hari" },
        { value: "90", label: "90 Hari" },

    ];

    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(loadingTimer);
    }, []);

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse">
                        <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-emerald-700 font-medium">
                        Memuat Statistik...
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
                        <a href="/sds">
                            <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500 hover:text-emerald-600 cursor-pointer transition-colors" />
                        </a>
                        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
                            Statistik Keuangan
                        </h1>
                    </div>
                </div>
                <div className="flex justify-end mb-6">
                    <div className="relative inline-flex bg-white/60 rounded-xl p-1 shadow-inner">
                        <div
                            className="absolute top-1 left-1 w-1/3 h-[calc(100%-0.5rem)] bg-emerald-500 rounded-xl transition-all duration-300 ease-in-out shadow-lg"
                            style={{
                                transform: `translateX(${
                                    periodOptions.findIndex(opt => opt.value === selectedPeriod) * 100
                                }%)`,
                            }}
                        ></div>
                        {periodOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setSelectedPeriod(option.value)}
                                className={`relative z-10 w-28 text-sm font-medium py-2 px-4 rounded-xl transition-all duration-300 ${
                                    selectedPeriod === option.value ? "text-white" : "text-slate-700"
                                } flex items-center justify-center gap-2`}
                            >
                                <Calendar className="w-4 h-4" />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">Saldo Bersih</h3>
                        </div>
                        <div className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatCurrency(balance)}
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                            {selectedPeriod !== "all" ? `${selectedPeriod} hari terakhir` : "Keseluruhan"}
                        </p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">Rata-rata Harian</h3>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(averageDailyExpense)}
                        </div>
                        <p className="text-sm text-slate-500 mt-2">Pengeluaran per hari</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">Pengeluaran Terbesar</h3>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                            {formatCurrency(largestExpense)}
                        </div>
                        <p className="text-sm text-slate-500 mt-2">Transaksi tunggal</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">Total Transaksi</h3>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                            {filteredTransactions.length}
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                            {incomeTransactions} masuk, {expenseTransactions} keluar
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <PieChart className="w-6 h-6 text-emerald-600" />
                                Kategori Pengeluaran
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setChartType('pie')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        chartType === 'pie' ? 'bg-emerald-500 text-white' : 'bg-white/60 text-slate-600'
                                    }`}
                                >
                                    <PieChart className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setChartType('bar')}
                                    className={`p-2 rounded-lg transition-colors ${
                                        chartType === 'bar' ? 'bg-emerald-500 text-white' : 'bg-white/60 text-slate-600'
                                    }`}
                                >
                                    <BarChart3 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === 'pie' ? (
                                    <RechartsPieChart>
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value), 'Jumlah']}
                                            labelStyle={{ color: '#334155' }}
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <RechartsPieChart data={categoryChartData} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                                            {categoryChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </RechartsPieChart>
                                    </RechartsPieChart>
                                ) : (
                                    <BarChart data={categoryChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#64748b"
                                            fontSize={12}
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            fontSize={12}
                                            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                        />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value), 'Jumlah']}
                                            labelStyle={{ color: '#334155' }}
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {categoryChartData.slice(0, 6).map((category, index) => (
                                <div key={category.name} className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <span className="text-sm font-medium text-slate-700 truncate">
                                        {category.emoji} {category.name}
                                    </span>
                                    <span className="text-xs text-slate-500 ml-auto">
                                        {category.percentage}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                            Tren Bulanan
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#64748b"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            formatCurrency(value),
                                            name === 'income' ? 'Pemasukan' : name === 'expense' ? 'Pengeluaran' : 'Saldo Bersih'
                                        ]}
                                        labelStyle={{ color: '#334155' }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="income"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#incomeGradient)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expense"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#expenseGradient)"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="net"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        strokeDasharray="5 5"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20 mb-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-emerald-600" />
                        Ringkasan & Rekomendasi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-emerald-800">Kategori Terbesar</h4>
                            </div>
                            <p className="text-emerald-700">
                                <span className="font-bold">{categoryChartData[0]?.name}</span> adalah pengeluaran terbesar Anda
                                ({categoryChartData[0]?.percentage}% dari total pengeluaran)
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-blue-800">Status Keuangan</h4>
                            </div>
                            <p className="text-blue-700">
                                {balance >= 0 ? (
                                    <span>✅ Keuangan Anda <span className="font-bold">sehat</span> dengan saldo positif</span>
                                ) : (
                                    <span>⚠️ Perlu <span className="font-bold">perhatian</span>, pengeluaran melebihi pemasukan</span>
                                )}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-purple-800">Rekomendasi</h4>
                            </div>
                            <p className="text-purple-700">
                                {averageDailyExpense > 300000 ? (
                                    <>Coba kurangi pengeluaran harian menjadi <span className="font-bold">di bawah 300rb</span></>
                                ) : (
                                    <>Pertahankan <span className="font-bold">pola pengeluaran</span> yang sudah baik ini</>
                                )}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-orange-800">Pola Transaksi</h4>
                            </div>
                            <p className="text-orange-700">
                                Rata-rata <span className="font-bold">{Math.round(filteredTransactions.length / (selectedPeriod === "30" ? 30 : selectedPeriod === "90" ? 90 : 365))} transaksi/hari</span>
                                {filteredTransactions.length / (selectedPeriod === "30" ? 30 : selectedPeriod === "90" ? 90 : 365) > 2 ? " - cukup aktif" : " - stabil"}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
                                    <TrendingDown className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-rose-800">Peluang Hemat</h4>
                            </div>
                            <p className="text-rose-700">
                                Fokus pada kategori <span className="font-bold">{categoryChartData[0]?.name}</span> dan
                                <span className="font-bold"> {categoryChartData[1]?.name}</span> untuk penghematan maksimal
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 border border-teal-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-teal-800">Target Bulanan</h4>
                            </div>
                            <p className="text-teal-700">
                                Target pengeluaran ideal: <span className="font-bold">{formatCurrency(totalIncome * 0.7)}</span>
                                ({totalExpense <= totalIncome * 0.7 ? "✅ Tercapai" : "❌ Terlampaui"})
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-5 border border-slate-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-500 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-slate-800">Efisiensi</h4>
                            </div>
                            <p className="text-slate-700">
                                Rasio pengeluaran: <span className="font-bold">{((totalExpense / totalIncome) * 100).toFixed(1)}%</span> dari pemasukan
                                {(totalExpense / totalIncome) < 0.8 ? " - Sangat baik!" : " - Perlu optimasi"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-emerald-600" />
                        Detail Kategori Pengeluaran
                    </h3>
                    <div className="space-y-4">
                        {categoryChartData.slice(0, 5).map((category, index) => (
                            <div key={category.name} className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shadow-lg">
                                                {category.emoji}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-lg">{category.name}</h4>
                                                <p className="text-slate-600 text-sm">{category.count} transaksi</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-red-500 mb-1">
                                            {formatCurrency(category.value)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${category.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-slate-600">{category.percentage}%</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Rata-rata: {formatCurrency(category.value / category.count)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RAnalitik;
