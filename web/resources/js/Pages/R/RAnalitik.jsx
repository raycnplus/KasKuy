import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PieChart as PieIcon,
  RefreshCw,
  Wallet,
  Sparkles,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import api from "../../api";

const bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const formatRupiah = (n) => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(Number(n||0)).replace("IDR","Rp");

const RAnalitik = () => {
  const [selectedDate,setSelectedDate] = useState(new Date());
  const [openPicker,setOpenPicker] = useState(false);
  const [loading,setLoading] = useState(true);
  const [loadingSmall,setLoadingSmall] = useState(false);
  const [error,setError] = useState(null);
  const [compare,setCompare] = useState({current:{income:0,expense:0,balance:0},previous:{income:0,expense:0,balance:0},change_pct:{income:null,expense:null,balance:null}});
  const [transactions,setTransactions] = useState([]);

  const monthNum = selectedDate.getMonth()+1;
  const yearNum = selectedDate.getFullYear();

  const daysInMonth = (y,m) => new Date(y,m,0).getDate();
  const dayCount = daysInMonth(yearNum,monthNum);

  const fetchMonthlyCompare = useCallback(async() => {
    const {data} = await api.get("reports/monthly-compare",{params:{month:monthNum,year:yearNum}});
    return data;
  },[monthNum,yearNum]);

  const fetchLatestTransactions = useCallback(async() => {
    const {data} = await api.get("reports/latest-transaction",{params:{month:monthNum,year:yearNum}});
    return data?.transactions||[];
  },[monthNum,yearNum]);

  const loadAll = useCallback(async(withSpinner=false)=>{
    try{
      if(withSpinner) setLoadingSmall(true);
      const [cmp, txs] = await Promise.all([fetchMonthlyCompare(), fetchLatestTransactions()]);
      setCompare(cmp);
      setTransactions(Array.isArray(txs)?txs:[]);
      setError(null);
    }catch(e){
      setError("Gagal memuat analitik.");
    }finally{
      if(withSpinner) setLoadingSmall(false);
      setLoading(false);
    }
  },[fetchMonthlyCompare,fetchLatestTransactions]);

  useEffect(()=>{ setLoading(true); loadAll(); },[loadAll]);
  useEffect(()=>{ const t=setInterval(()=>loadAll(),10000); return ()=>clearInterval(t); },[loadAll]);

  const dailySeries = useMemo(()=>{
    const base = Array.from({length:dayCount},(_,i)=>({d:i+1,income:0,expense:0}));
    transactions.forEach(tx=>{
      const d = new Date(tx.date);
      if(d.getMonth()+1!==monthNum || d.getFullYear()!==yearNum) return;
      const day = d.getDate();
      if(tx.type==='Pemasukan') base[day-1].income += Number(tx.amount);
      else base[day-1].expense += Number(tx.amount);
    });
    return base.map(r=>({
      name: r.d.toString(),
      Pemasukan: r.income,
      Pengeluaran: r.expense,
      Selisih: r.income - r.expense,
    }));
  },[transactions,dayCount,monthNum,yearNum]);

  const kategoriExpense = useMemo(()=>{
    const m = new Map();
    transactions.forEach(tx=>{
      if(tx.type!=="Pengeluaran") return;
      const name = tx.category?.name || "Lainnya";
      const icon = tx.category?.icon || "📋";
      const amt = Number(tx.amount)||0;
      const cur = m.get(name)||{name,icon,total:0,count:0};
      cur.total += amt;
      cur.count += 1;
      m.set(name,cur);
    });
    const arr = Array.from(m.values()).sort((a,b)=>b.total-a.total);
    return {arr,total:arr.reduce((s,x)=>s+x.total,0)};
  },[transactions]);

  const incomeExpenseByWeek = useMemo(()=>{
    const weeks = [{w:1,i:0,e:0},{w:2,i:0,e:0},{w:3,i:0,e:0},{w:4,i:0,e:0},{w:5,i:0,e:0}];
    transactions.forEach(tx=>{
      const d=new Date(tx.date); if(d.getMonth()+1!==monthNum||d.getFullYear()!==yearNum) return;
      const day=d.getDate(); const w=Math.min(5,Math.ceil(day/7));
      if(tx.type==='Pemasukan') weeks[w-1].i+=Number(tx.amount); else weeks[w-1].e+=Number(tx.amount);
    });
    return weeks.map((x,idx)=>({name:`Minggu ${idx+1}`,Pemasukan:x.i,Pengeluaran:x.e}));
  },[transactions,monthNum,yearNum]);

  const income = Number(compare.current?.income||0);
  const expense = Number(compare.current?.expense||0);
  const balance = Number(compare.current?.balance||0);
  const ci = compare.change_pct?.income; const ce = compare.change_pct?.expense; const cb = compare.change_pct?.balance;

  const handleMonthChange=(i)=>{ const d=new Date(selectedDate); d.setDate(1); d.setMonth(i); if(d>new Date()) return; setSelectedDate(d); setOpenPicker(false); };
  const handleYearChange=(dir)=>{ const y=selectedDate.getFullYear()+dir; const now=new Date().getFullYear(); if(y>now) return; const d=new Date(selectedDate); d.setFullYear(y); d.setDate(1); setSelectedDate(d); };

  const pieColors=["#ef4444","#f59e0b","#10b981","#3b82f6","#8b5cf6","#ec4899","#22d3ee","#84cc16","#f97316","#14b8a6"];

  const insights = useMemo(()=>{
    const expTx = transactions.filter(t=>t.type==="Pengeluaran");
    const topTx = expTx.slice().sort((a,b)=>Number(b.amount)-Number(a.amount))[0];
    const byDay = new Map();
    expTx.forEach(t=>{ const d=new Date(t.date); const k=d.toISOString().slice(0,10); byDay.set(k,(byDay.get(k)||0)+Number(t.amount)); });
    let worstDay = null; let worstVal = 0; byDay.forEach((v,k)=>{ if(v>worstVal){worstVal=v; worstDay=k;} });
    const avgExpense = expTx.reduce((s,t)=>s+Number(t.amount),0)/(dayCount||1);
    const avgIncome = transactions.filter(t=>t.type==="Pemasukan").reduce((s,t)=>s+Number(t.amount),0)/(dayCount||1);
    const topCat = kategoriExpense.arr[0];
    return {
      topCategory: topCat ? { name: topCat.name, total: topCat.total, icon: topCat.icon } : null,
      topTransaction: topTx ? { name: topTx.category?.name||"Lainnya", amount: topTx.amount, date: new Date(topTx.date).toLocaleDateString("id-ID") } : null,
      worstDay: worstDay ? { date: new Date(worstDay).toLocaleDateString("id-ID"), total: worstVal } : null,
      avgExpense, avgIncome,
    };
  },[transactions,dayCount,kategoriExpense]);

  if(loading){
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <p className="text-emerald-700 font-medium">Memuat analitik...</p>
        </div>
      </div>
    );
  }

  if(error){
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <Activity className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Terjadi Kesalahan</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={()=>loadAll(true)} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 text-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-teal-200/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 relative z-10 max-w-7xl mx-auto pb-28">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-x-2">
            <a href="/dashboard" className="inline-flex">
              <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500 hover:text-emerald-600 cursor-pointer" />
            </a>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Analitik</h1>
          </div>
          <div className="relative z-[60]">
            <button onClick={()=>setOpenPicker(s=>!s)} className="flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-md rounded-xl border border-white/30 text-slate-700 font-medium hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{bulan[monthNum-1]} {yearNum}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openPicker?"rotate-180":""}`} />
            </button>
            {openPicker && (
              <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30 z-[9999] min-w-[320px]">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={()=>handleYearChange(-1)} className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-emerald-600" /></button>
                  <h3 className="text-lg font-bold text-slate-800">{yearNum}</h3>
                  <button onClick={()=>handleYearChange(1)} className={`p-2 rounded-lg ${yearNum>=new Date().getFullYear()?"opacity-50 cursor-not-allowed text-gray-400":"hover:bg-emerald-50 text-emerald-600"}`} disabled={yearNum>=new Date().getFullYear()}>
                    <ChevronRight className={`w-5 h-5 ${yearNum>=new Date().getFullYear()?"text-gray-400":"text-emerald-600"}`} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {bulan.map((m,i)=>{
                    const today=new Date(); const disabled=yearNum>today.getFullYear()||(yearNum===today.getFullYear() && i>today.getMonth());
                    return (
                      <button key={m} onClick={()=>handleMonthChange(i)} disabled={disabled} className={`p-3 rounded-xl text-sm font-medium transition-all ${disabled?"bg-gray-100 text-gray-400 cursor-not-allowed opacity-50":(i===monthNum-1?"bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-105":"bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700")}`}>{m.slice(0,3)}</button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[{label:"Pengeluaran",amount:expense,pct:ce,icon:ArrowDownRight,grad:"from-rose-500 to-red-600",text:"text-rose-600"},{label:"Pemasukan",amount:income,pct:ci,icon:ArrowUpRight,grad:"from-emerald-500 to-green-600",text:"text-emerald-600"},{label:"Saldo",amount:balance,pct:cb,icon:Wallet,grad:"from-cyan-500 to-blue-600",text:"text-slate-800"}].map((s)=>{
            const Icon=s.icon; const showPct=s.pct!==null&&s.pct!==0; const up=(s.pct||0)>0;
            return (
              <div key={s.label} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center shadow-lg`}><Icon className="w-6 h-6 text-white" /></div>
                  {showPct && <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${up?"text-emerald-600 border-emerald-500/40":"text-rose-600 border-rose-500/40"}`}>{up?"+":""}{s.pct}%</span>}
                </div>
                <div className="space-y-1">
                  <h3 className={`text-2xl font-bold ${s.label==="Saldo"?"text-slate-800":s.text}`}>{formatRupiah(s.amount)}</h3>
                  <p className="text-sm font-medium text-slate-600">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-600" /> Insight Cepat</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white/80 rounded-2xl p-4 border border-white/30">
              <p className="text-xs text-slate-500">Kategori Terbesar</p>
              <div className="mt-1 font-semibold text-slate-800 flex items-center gap-2"><span className="text-lg">{insights.topCategory?.icon||""}</span>{insights.topCategory?.name||"-"}</div>
              <div className="text-sm text-rose-600">{insights.topCategory?`-${formatRupiah(insights.topCategory.total)}`:"-"}</div>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 border border-white/30">
              <p className="text-xs text-slate-500">Transaksi Terbesar</p>
              <div className="mt-1 font-semibold text-slate-800">{insights.topTransaction?.name||"-"}</div>
              <div className="text-sm text-rose-600">{insights.topTransaction?`-${formatRupiah(insights.topTransaction.amount)}`:"-"}</div>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 border border-white/30">
              <p className="text-xs text-slate-500">Hari Paling Boros</p>
              <div className="mt-1 font-semibold text-slate-800">{insights.worstDay?.date||"-"}</div>
              <div className="text-sm text-rose-600">{insights.worstDay?`-${formatRupiah(insights.worstDay.total)}`:"-"}</div>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 border border-white/30">
              <p className="text-xs text-slate-500">Rata-rata Harian</p>
              <div className="mt-1 text-sm"><span className="text-slate-600">Pemasukan:</span> <span className="font-semibold text-emerald-600">{formatRupiah(insights.avgIncome)}</span></div>
              <div className="mt-1 text-sm"><span className="text-slate-600">Pengeluaran:</span> <span className="font-semibold text-rose-600">{formatRupiah(insights.avgExpense)}</span></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-emerald-600" /> Tren Harian</h2>
              {loadingSmall && <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full"><RefreshCw className="w-3 h-3 text-green-600 animate-spin" /><span className="text-xs text-green-600">Loading...</span></div>}
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySeries} margin={{top:10,right:10,left:0,bottom:0}}>
                  <defs>
                    <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v)=>v>=1000?`${Math.round(v/1000)}k`:v} />
                  <Tooltip formatter={(v,n)=>[formatRupiah(v),n]} labelFormatter={(l)=>`Tanggal ${l} ${bulan[monthNum-1]} ${yearNum}`} />
                  <Area type="monotone" dataKey="Pemasukan" stroke="#10b981" fill="url(#inc)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Pengeluaran" stroke="#ef4444" fill="url(#exp)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><PieIcon className="w-5 h-5 text-emerald-600" /> Komposisi Pengeluaran</h2>
            </div>
            <div className="h-72">
              {kategoriExpense.arr.length>0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={kategoriExpense.arr} dataKey="total" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                      {kategoriExpense.arr.map((_,i)=>(<Cell key={`c-${i}`} fill={pieColors[i%pieColors.length]} />))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip formatter={(v,n,i)=>[formatRupiah(v),kategoriExpense.arr[i?.payload?.index||0]?.name]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">Belum ada data</div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {kategoriExpense.arr.slice(0,5).map((k,i)=> (
                <div key={k.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="text-lg">{k.icon||"📋"}</span><span className="text-sm font-medium text-slate-700">{k.name}</span></div>
                  <div className="text-sm font-semibold text-slate-800">{formatRupiah(k.total)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-600" /> Ringkasan Mingguan</h2></div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeExpenseByWeek}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v)=>v>=1000?`${Math.round(v/1000)}k`:v} />
                  <Tooltip formatter={(v,n)=>[formatRupiah(v),n]} />
                  <Legend />
                  <Bar dataKey="Pemasukan" fill="#10b981" radius={[6,6,0,0]} />
                  <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ArrowDownRight className="w-5 h-5 text-emerald-600" /> Pengeluaran Terbesar</h2></div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {transactions.filter(t=>t.type==="Pengeluaran").sort((a,b)=>Number(b.amount)-Number(a.amount)).slice(0,8).map((t)=> (
                <div key={t.id} className="flex items-center justify-between bg-white/70 rounded-xl p-3 border border-white/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">{t.category?.icon||"📋"}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{t.category?.name||"Lainnya"}</p>
                      <p className="text-xs text-slate-500 truncate">{new Date(t.date).toLocaleDateString("id-ID",{day:"2-digit",month:"short"})}</p>
                    </div>
                  </div>
                  <div className="text-right text-rose-600 font-bold">-{formatRupiah(t.amount)}</div>
                </div>
              ))}
              {transactions.filter(t=>t.type==="Pengeluaran").length===0 && <div className="text-center text-slate-500">Belum ada data</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAnalitik;
