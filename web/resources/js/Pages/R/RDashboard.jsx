import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Eye,
  EyeOff,
  Download,
  Notebook,
  BarChart3,
  ReceiptText,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const axios = (() => {
  const api = window.axios?.create
    ? window.axios.create({ baseURL: "http://localhost:8000/api/", withCredentials: true })
    : null;
  if (api) {
    api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });
  }
  return api;
})();

class ApiService {
  constructor() {
    this.api = axios || this.createAxiosInstance();
  }
  createAxiosInstance() {
    return { get: (url) => this.fallbackRequest("GET", url) };
  }
  async fallbackRequest(method, url) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) };
    const res = await fetch(`http://localhost:8000/api${url}`, { method, headers, credentials: "include" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { data: await res.json() };
  }
  async getMonthlyCompare(month, year) {
    const m = String(month).padStart(2, "0");
    return (await this.api.get(`/reports/monthly-compare?month=${m}&year=${year}`)).data;
  }
  async getLatestTransactions(month, year) {
    const m = String(month).padStart(2, "0");
    return (await this.api.get(`/reports/latest-transaction?month=${m}&year=${year}`)).data;
  }
  async getProfile() {
    const res = await this.api.get("/profile");
    return res.data;
  }
}

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

const splitTitleAndDesc = (raw) => {
  if (!raw) return { title: "Transaksi", desc: "" };
  const s = String(raw).trim();
  const ds = [" — ", " – ", " - ", "\n", " | "];
  for (const d of ds) {
    const i = s.indexOf(d);
    if (i > 0) return { title: s.slice(0, i).trim(), desc: s.slice(i + d.length).trim() };
  }
  return { title: s, desc: "" };
};

const RDashboard = () => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [prevMonthlyIncome, setPrevMonthlyIncome] = useState(0);
  const [prevMonthlyExpense, setPrevMonthlyExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(false);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiService] = useState(() => new ApiService());
  const monthlyLockRef = useRef(false);
  const txLockRef = useRef(false);

  const monthNum = selectedDate.getMonth() + 1;
  const yearNum = selectedDate.getFullYear();

  const pctChange = (curr, prev) => {
    if (prev === 0) return null;
    return Number((((curr - prev) / prev) * 100).toFixed(1));
  };

  const computedBalance = monthlyIncome - monthlyExpense;
  const prevComputedBalance = prevMonthlyIncome - prevMonthlyExpense;
  const incomeChange = pctChange(monthlyIncome, prevMonthlyIncome);
  const expenseChange = pctChange(monthlyExpense, prevMonthlyExpense);
  const balanceChange = pctChange(computedBalance, prevComputedBalance);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const loadMonthly = useCallback(
    async (withSpinner = false) => {
      if (monthlyLockRef.current) return;
      try {
        if (withSpinner) setIsMonthlyLoading(true);
        monthlyLockRef.current = true;
        const data = await apiService.getMonthlyCompare(monthNum, yearNum);
        const cur = data.current || {};
        const prev = data.previous || {};
        setMonthlyIncome(Number(cur.income || 0));
        setMonthlyExpense(Number(cur.expense || 0));
        setPrevMonthlyIncome(Number(prev.income || 0));
        setPrevMonthlyExpense(Number(prev.expense || 0));
      } catch {
        setError("Gagal memuat laporan bulanan.");
      } finally {
        monthlyLockRef.current = false;
        if (withSpinner) setIsMonthlyLoading(false);
      }
    },
    [apiService, monthNum, yearNum]
  );

  const getEmojiForCategory = (name) => {
    const map = { Makanan: "🍽️", Transportasi: "⛽", Hiburan: "🎉", Belanja: "🛒", Gaji: "💰", Kesehatan: "🏥", Pendidikan: "📚", Lainnya: "📋" };
    return map[name] || "📋";
  };
  const formatDateFromAPI = (s) => {
    const d = new Date(s);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };
  const formatTimeFromAPI = (s) => new Date(s).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
  const formatCurrency = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n).replace("IDR", "Rp");

  const loadTransactions = useCallback(
    async (withSpinner = false) => {
      if (txLockRef.current) return;
      try {
        if (withSpinner) setIsTransactionsLoading(true);
        txLockRef.current = true;
        const res = await apiService.getLatestTransactions(monthNum, yearNum);
        const raw = res.transactions || res.data || res || [];
        const mapped = Array.isArray(raw)
          ? raw.map((tx) => {
              const { title, desc } = splitTitleAndDesc(tx.description || "");
              const d = new Date(tx.date);
              return {
                id: tx.id,
                emoji: getEmojiForCategory(tx.category?.name || "Lainnya"),
                title: title || "Transaksi",
                Transaksi: tx.type,
                tanggal: formatDateFromAPI(tx.date),
                waktu: formatTimeFromAPI(tx.created_at || tx.date),
                deskripsi: desc || "",
                nominal: tx.type === "Pemasukan" ? Number(tx.amount) : -Number(tx.amount),
                kategori: tx.category?.name || "Lainnya",
                month: d.getMonth() + 1,
                year: d.getFullYear(),
              };
            })
          : [];
        const filtered = mapped.filter((t) => t.month === monthNum && t.year === yearNum).map(({ month, year, ...t }) => t);
        setTransactions(filtered);
      } catch {
        setError("Gagal memuat transaksi.");
      } finally {
        txLockRef.current = false;
        if (withSpinner) setIsTransactionsLoading(false);
      }
    },
    [apiService, monthNum, yearNum]
  );

  const loadProfile = useCallback(async () => {
    try {
      const res = await apiService.getProfile();
      const data = res.data || res;
      setUserProfile(data);
    } catch {
      setUserProfile({ name: "User" });
    }
  }, [apiService]);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setIsLoading(false);
          return;
        }
        await Promise.allSettled([loadMonthly(true), loadTransactions(true), loadProfile()]);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [loadMonthly, loadTransactions, loadProfile]);

  useEffect(() => {
    const id = setInterval(() => {
      loadMonthly();
      loadTransactions();
    }, 10000);
    return () => clearInterval(id);
  }, [loadMonthly, loadTransactions]);

  useEffect(() => {
    loadMonthly();
    loadTransactions();
  }, [monthNum, yearNum, loadMonthly, loadTransactions]);

  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h >= 5 && h < 12) return "Selamat Pagi";
    if (h >= 12 && h < 15) return "Selamat Siang";
    if (h >= 15 && h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const MonthYearPicker = () => {
    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth();
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    const handleMonthChange = (idx) => {
      if (currentYear > todayYear || (currentYear === todayYear && idx > todayMonth)) return;
      const d = new Date(selectedDate);
      d.setDate(1);
      d.setMonth(idx);
      setSelectedDate(d);
      setShowDatePicker(false);
    };
    const handleYearChange = (dir) => {
      const ny = currentYear + dir;
      if (ny > todayYear) return;
      const d = new Date(selectedDate);
      d.setDate(1);
      d.setFullYear(ny);
      setSelectedDate(d);
    };
    const isMonthDisabled = (idx) => currentYear > todayYear || (currentYear === todayYear && idx > todayMonth);

    return (
      <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 z-[9999] min-w-[320px]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => handleYearChange(-1)} className="p-2 hover:bg-emerald-50 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-emerald-600" />
          </button>
          <h3 className="text-lg font-bold text-slate-800">{currentYear}</h3>
          <button
            onClick={() => handleYearChange(1)}
            disabled={currentYear >= todayYear}
            className={`p-2 rounded-lg ${currentYear >= todayYear ? "opacity-50 cursor-not-allowed text-gray-400" : "hover:bg-emerald-50 text-emerald-600"}`}
          >
            <ChevronRight className={`w-5 h-5 ${currentYear >= todayYear ? "text-gray-400" : "text-emerald-600"}`} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((m, i) => (
            <button
              key={m}
              onClick={() => handleMonthChange(i)}
              disabled={isMonthDisabled(i)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                isMonthDisabled(i)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                  : i === currentMonth
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-105"
                  : "bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const getTimeAgo = (dateStr) => {
    const [day, monthName, year] = dateStr.split(" ");
    const idx = months.indexOf(monthName);
    const d = new Date(Number(year), idx, Number(day));
    const now = new Date();
    const diff = Math.ceil(Math.abs(now - d) / (1000 * 60 * 60 * 24));
    if (diff === 1) return "Kemarin";
    if (diff < 7) return `${diff} hari lalu`;
    return dateStr;
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <p className="text-emerald-700 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Terjadi Kesalahan</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Pengeluaran",
      amount: monthlyExpense,
      prev: prevMonthlyExpense,
      change: expenseChange,
      icon: ArrowDownRight,
      color: "from-rose-500 to-red-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
      borderColor: "border-rose-200",
    },
    {
      label: "Pemasukan",
      amount: monthlyIncome,
      prev: prevMonthlyIncome,
      change: incomeChange,
      icon: ArrowUpRight,
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 text-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-teal-200/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg ring-4 ring-white/20">👤</div>
            <div>
              <h1 className="font-bold text-2xl sm:text-3xl text-slate-800">{getGreeting()}, {userProfile?.name || "User"}!</h1>
              <p className="text-sm text-slate-600 mt-1">
                {currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false })} - {currentTime.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
              {userProfile?.username && <p className="text-xs text-slate-500 mt-1">@{userProfile.username}</p>}
            </div>
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-lg border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg sm:text-2xl font-semibold text-slate-700">Total saldo saat ini</h2>
                    <button onClick={() => setIsBalanceHidden(!isBalanceHidden)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      {isBalanceHidden ? <EyeOff className="w-5 h-5 text-slate-500" /> : <Eye className="w-5 h-5 text-slate-500" />}
                    </button>
                  </div>
                  <div className="relative z-[60]">
                    <button
                      onClick={() => setShowDatePicker((s) => !s)}
                      className="flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-md rounded-xl border border-white/30 text-slate-700 font-medium hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    >
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>{months[monthNum - 1]} {yearNum}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showDatePicker ? "rotate-180" : ""}`} />
                    </button>
                    {showDatePicker && <MonthYearPicker />}
                  </div>
                </div>
                <div className="flex items-baseline gap-4 mb-1">
                  <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent transition-all duration-300 ${isBalanceHidden ? "blur-lg" : ""}`}>
                    {formatCurrency(computedBalance)}
                  </h1>
                </div>
                <div className="mt-1">
                  {balanceChange !== null && balanceChange !== 0 ? (
                    <p className={`inline-block text-sm font-medium ${balanceChange > 0 ? "text-emerald-600 border-2 border-emerald-600/40" : "text-rose-600 border-2 border-rose-600/40"} px-2 py-1 rounded-lg mt-4`}>
                      {balanceChange > 0 ? "+" : ""}
                      {balanceChange}% dari bulan sebelumnya
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                {[
                  {
                    label: "Pengeluaran",
                    amount: monthlyExpense,
                    change: expenseChange,
                    icon: ArrowDownRight,
                    color: "from-rose-500 to-red-600",
                    bgColor: "bg-rose-50",
                    textColor: "text-rose-600",
                    borderColor: "border-rose-200",
                  },
                  {
                    label: "Pemasukan",
                    amount: monthlyIncome,
                    change: incomeChange,
                    icon: ArrowUpRight,
                    color: "from-emerald-500 to-green-600",
                    bgColor: "bg-emerald-50",
                    textColor: "text-emerald-600",
                    borderColor: "border-emerald-200",
                  },
                ].map((stat) => {
                  const Icon = stat.icon;
                  const showPct = stat.change !== null && stat.change !== 0;
                  const up = (stat.change || 0) > 0;
                  return (
                    <div
                      key={stat.label}
                      className={`bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${stat.borderColor} group relative`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {showPct ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-bold border ${up ? "text-emerald-600 border-2 border-emerald-600/40" : "text-rose-600 border-2 border-rose-600/40"} px-2 py-1 rounded-lg`}>
                            {up ? "+" : ""}
                            {stat.change}%
                          </span>
                        ) : null}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-800">{formatCurrency(stat.amount)}</h3>
                        <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 relative z-0">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">Aksi Cepat</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { href: "/sct", icon: Download, label: "Catat", desc: "Tambah transaksi", color: "from-blue-500 to-blue-600" },
              { href: "/sdk", icon: Notebook, label: "Daftar Kas", desc: "Lihat semua kas", color: "from-purple-500 to-purple-600" },
              { href: "/san", icon: BarChart3, label: "Analitik", desc: "Laporan detail", color: "from-orange-500 to-orange-600" },
              { href: "/split-bill", icon: ReceiptText, label: "Split Bill", desc: "Bagi tagihan", color: "from-pink-500 to-pink-600" },
            ].map((a) => (
              <a key={a.label} href={a.href} className="group flex flex-col items-center p-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <a.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 mb-1">{a.label}</h3>
                <p className="text-xs text-slate-500 text-center">{a.desc}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20 relative z-0">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-600" />
                Transaksi Terbaru
              </h2>
              {isTransactionsLoading && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                  <RefreshCw className="w-3 h-3 text-green-600 animate-spin" />
                  <span className="text-xs text-green-600">Loading...</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto p-3">
            {transactions.length > 0 ? (
              transactions.map((tx, index) => {
                const meta =
                  {
                    Pemasukan: { icon: ArrowUpRight, color: "from-green-500 to-green-600", bg: "bg-green-50" },
                    Pengeluaran: { icon: ArrowDownRight, color: "from-red-500 to-red-600", bg: "bg-red-50" },
                  }[tx.Transaksi] || { icon: Activity, color: "from-slate-500 to-slate-600", bg: "bg-slate-50" };
                const IconComponent = meta.icon;
                return (
                  <div
                    key={tx.id}
                    className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/20 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="relative z-[100]">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shadow-lg">{tx.emoji}</div>
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-md`}>
                            <IconComponent className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{tx.title}</h3>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${meta.bg} text-slate-700`}>{tx.kategori}</span>
                            <div className="flex items-center gap-1 text-slate-500 text-sm">
                              <Clock className="w-3 h-3" />
                              <span>{getTimeAgo(tx.tanggal)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 text-sm">
                              <span>{tx.waktu}</span>
                            </div>
                          </div>
                          {tx.deskripsi ? <p className="text-sm text-slate-600 leading-relaxed">{tx.deskripsi}</p> : null}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`font-bold text-xl mb-1 ${tx.nominal > 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {tx.nominal > 0 ? "+" : ""}
                          {formatCurrency(Math.abs(tx.nominal))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg font-medium mb-2">Belum ada transaksi</p>
                <p className="text-slate-400 text-sm">Mulai catat transaksi pertama Anda</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className={`w-2 h-2 rounded-full ${error ? "bg-red-500" : "bg-emerald-500"} animate-pulse`}></div>
                  <span>{error ? "Terputus dari server" : "Terhubung ke server"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Auto refresh aktif setiap 10 detik</span>
                </div>
              </div>
              <div className="text-xs text-slate-400">Smart refresh: ON</div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800">Smart Refresh System</h3>
              <p className="text-sm text-blue-600">Auto refresh aktif: Laporan bulanan & transaksi diperbarui setiap 10 detik untuk bulan yang dipilih.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RDashboard;
