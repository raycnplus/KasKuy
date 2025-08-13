import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  Upload,
  Image as ImageIcon,
  Users,
  UserPlus,
  Trash2,
  Check,
  X,
  Search,
  ListChecks,
  Receipt as ReceiptIcon,
  CalendarDays,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import BackButton from "../../components/lainnya/BackButton";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(Number(n || 0))
    .replace("IDR", "Rp");

const StepBadge = ({ idx, active, done, label }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
        done
          ? "bg-emerald-500 text-white"
          : active
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {done ? <Check className="w-4 h-4" /> : idx}
    </div>
    <span className={`text-sm font-medium ${active ? "text-slate-900" : "text-slate-500"}`}>{label}</span>
  </div>
);

const Divider = () => <div className="h-px bg-white/60" />;

const Empty = ({ icon: Icon, title, desc, actions }) => (
  <div className="text-center py-14">
    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center shadow">
      <Icon className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-slate-800 font-semibold">{title}</h3>
    {desc && <p className="text-slate-500 text-sm mt-1">{desc}</p>}
    {actions}
  </div>
);

const Chip = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-xl text-sm border transition ${
      active
        ? "bg-emerald-500 text-white border-emerald-500"
        : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
    }`}
  >
    {children}
  </button>
);

const Modal = ({ open, onClose, title, children, footer }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] grid place-items-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-white/60 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="p-5">{children}</div>
          {footer && <div className="p-5 border-t border-slate-100">{footer}</div>}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const RSplitBill = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [receipt, setReceipt] = useState(null);
  const [items, setItems] = useState([]);

  const [me, setMe] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [assign, setAssign] = useState({});
  const [savingAssign, setSavingAssign] = useState(false);

  const [summary, setSummary] = useState(null);

  const fileRef = useRef();
  const [fileName, setFileName] = useState("");

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 2200);
  };

  const loadProfile = async () => {
    try {
      const { data } = await api.get("/profile");
      setMe(data?.data || null);
    } catch {}
  };

  const loadItems = async (receiptId) => {
    const { data } = await api.get(`/receipt-items/${receiptId}`);
    const list = data?.data || [];
    setItems(list);
    const map = {};
    list.forEach((it) => {
      const pid = it?.assignment?.user?.id || it?.assignment?.participant_id;
      if (pid) map[it.id] = pid;
    });
    setAssign(map);
  };

  const loadParticipants = async (receiptId) => {
    const { data } = await api.get(`/receipt/${receiptId}/participants`);
    setParticipants(data?.data || []);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await api.post("/ocr", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const r = data?.data;
      setReceipt(r);
      setStep(2);
      await Promise.all([loadItems(r.id), loadParticipants(r.id)]);
      showToast("success", "Struk berhasil diproses ✨");
    } catch (e) {
      showToast("error", "Gagal mengunggah struk");
    } finally {
      setLoading(false);
    }
  };

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileName(f.name);
      handleUpload(f);
    }
  };

  const addSelf = async () => {
    if (!receipt || !me) return;
    try {
      await api.post(`/receipt/${receipt.id}/participants`, { user_id: me.id });
      await loadParticipants(receipt.id);
      showToast("success", "Kamu masuk sebagai partisipan");
    } catch (e) {
      showToast("error", e?.response?.data?.message || "Gagal menambahkan diri sendiri");
    }
  };

  const removeParticipant = async (p) => {
    if (!receipt) return;
    try {
      await api.delete(`/receipt/${receipt.id}/participants/${p.id}`);
      await loadParticipants(receipt.id);
      showToast("success", "Partisipan dihapus");
    } catch {
      showToast("error", "Gagal menghapus partisipan");
    }
  };

  const searchFriends = async (q) => {
    setSearchQuery(q);
    if (!q) {
      setSearchResults([]);
      return;
    }
    try {
      const { data } = await api.get(`/friends/search`, { params: { query: q } });
      setSearchResults(data?.data || []);
    } catch {
      setSearchResults([]);
    }
  };

  const addParticipant = async (user) => {
    if (!receipt) return;
    try {
      await api.post(`/receipt/${receipt.id}/participants`, { user_id: user.id });
      await loadParticipants(receipt.id);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      showToast("success", `${user.name || user.username} ditambahkan`);
    } catch (e) {
      showToast("error", e?.response?.data?.message || "Gagal menambahkan");
    }
  };

  const saveAssignments = async () => {
    if (!receipt) return;
    const payload = Object.entries(assign)
      .filter(([item_id, participant_id]) => participant_id)
      .map(([item_id, participant_id]) => ({ item_id: Number(item_id), participant_id }));
    if (!payload.length) {
      showToast("error", "Belum ada item yang di-assign");
      return;
    }
    setSavingAssign(true);
    try {
      await api.post(`/receipt/${receipt.id}/assignments`, { assignments: payload });
      await loadItems(receipt.id);
      showToast("success", "Assignment tersimpan");
    } catch {
      showToast("error", "Gagal menyimpan assignment");
    } finally {
      setSavingAssign(false);
    }
  };

  const fetchSummary = async () => {
    if (!receipt) return;
    try {
      const { data } = await api.get(`/receipts/summary/${receipt.id}`);
      setSummary(data);
      setStep(4);
    } catch {
      showToast("error", "Gagal memuat ringkasan");
    }
  };

  const canNextFromStep2 = participants.length > 0;
  const allAssigned = useMemo(() => {
    if (!items.length) return false;
    return items.every((it) => !!assign[it.id]);
  }, [items, assign]);

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 text-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-cyan-200/40 rounded-full blur-3xl" />
      </div>

      <div className="p-4 sm:p-6 lg:p-8 relative z-10 max-w-7xl mx-auto pb-28">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <a href="/dashboard" className="inline-flex">
              <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500 hover:text-emerald-600" />
            </a>
            <h1 className="text-xl sm:text-2xl font-semibold">Split Bill</h1>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/30 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <StepBadge idx={1} active={step===1} done={step>1} label="Unggah Struk" />
            <StepBadge idx={2} active={step===2} done={step>2} label="Partisipan" />
            <StepBadge idx={3} active={step===3} done={step>3} label="Assign Item" />
            <StepBadge idx={4} active={step===4} done={false} label="Ringkasan" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6">
          {step === 1 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 lg:p-10 border border-white/30 shadow-2xl">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Unggah Struk</h2>
                  <p className="text-slate-600 text-sm mt-1">Foto atau screenshot struk, nanti aku bacain otomatis 😉</p>
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/60">
                  <ReceiptIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  {fileName ? (
                    <p className="text-sm text-slate-600 mb-4">{fileName}</p>
                  ) : (
                    <p className="text-sm text-slate-500 mb-4">Tarik & lepas file ke sini atau pilih manual</p>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-medium shadow hover:brightness-105"
                      disabled={loading}
                    >
                      <Upload className="w-4 h-4" /> Pilih File
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
                  </div>
                  {loading && (
                    <div className="mt-4 text-emerald-700 text-sm">Memproses struk… sabar ya 🙏</div>
                  )}
                </div>
                {receipt && (
                  <div className="mt-6 rounded-2xl border border-slate-200 p-4 bg-white">
                    <div className="flex items-center gap-3 mb-3">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-semibold text-slate-800">Struk Terdeteksi</h3>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-slate-500">Toko</div>
                        <div className="font-semibold text-slate-800">{receipt.store_name || "-"}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Tanggal</div>
                        <div className="font-semibold text-slate-800">{new Date(receipt.date).toLocaleDateString("id-ID")}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Total</div>
                        <div className="font-semibold text-slate-800">{formatRupiah(receipt.total)}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow">
                        Lanjut <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Users className="w-5 h-5 text-emerald-600" /> Partisipan</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setSearchOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                      <Search className="w-4 h-4" /> Cari Teman
                    </button>
                    <button onClick={addSelf} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white font-medium">
                      <UserPlus className="w-4 h-4" /> Tambahkan Saya
                    </button>
                  </div>
                </div>

                {participants.length === 0 ? (
                  <Empty icon={Users} title="Belum ada partisipan" desc="Tambah teman atau dirimu sendiri dulu ya." />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {participants.map((p) => (
                      <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 truncate">{p.user?.name || p.user?.username || "Teman"}</div>
                          <div className="text-xs text-slate-500">@{p.user?.username}</div>
                        </div>
                        <button onClick={() => removeParticipant(p)} className="p-2 rounded-lg hover:bg-rose-50 text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => setStep(1)} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700">Kembali</button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!canNextFromStep2}
                    className={`px-5 py-2 rounded-xl font-semibold shadow inline-flex items-center gap-2 ${
                      canNextFromStep2 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Lanjut <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><ReceiptIcon className="w-4 h-4 text-emerald-600" /> Detail Struk</h3>
                {receipt ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Toko</span><span className="font-semibold text-slate-800">{receipt.store_name || "-"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Tanggal</span><span className="font-semibold text-slate-800">{new Date(receipt.date).toLocaleDateString("id-ID")}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-semibold text-slate-800">{formatRupiah(receipt.subtotal || 0)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Pajak</span><span className="font-semibold text-slate-800">{formatRupiah(receipt.tax || 0)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Total</span><span className="font-semibold text-slate-800">{formatRupiah(receipt.total || 0)}</span></div>
                  </div>
                ) : (
                  <Empty icon={CalendarDays} title="Belum ada struk" desc="Unggah dulu di langkah 1." />
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><ListChecks className="w-5 h-5 text-emerald-600" /> Assign Item</h2>
                  <button
                    onClick={saveAssignments}
                    disabled={!items.length || participants.length===0}
                    className={`px-4 py-2 rounded-xl font-semibold ${
                      !items.length || participants.length===0 ? "bg-slate-200 text-slate-500" : savingAssign ? "bg-emerald-500/80 text-white" : "bg-emerald-600 text-white"
                    }`}
                  >
                    {savingAssign ? "Menyimpan…" : "Simpan Semua"}
                  </button>
                </div>
                {(!items || items.length === 0) ? (
                  <Empty icon={ReceiptIcon} title="Item kosong" desc="Upload struk atau cek ulang hasil OCR." />
                ) : (
                  <div className="space-y-3">
                    {items.map((it) => (
                      <div key={it.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-800 truncate">{it.product}</div>
                            <div className="text-xs text-slate-500">Qty {it.quantity} × {formatRupiah(it.price)} = <span className="font-semibold text-slate-700">{formatRupiah(it.total)}</span></div>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-end">
                            {participants.map((p) => (
                              <Chip key={p.id} active={assign[it.id] === p.user?.id} onClick={() => setAssign((s) => ({ ...s, [it.id]: p.user?.id }))}>
                                {p.user?.name || p.user?.username}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(2)} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700">Kembali</button>
                  <button
                    onClick={fetchSummary}
                    disabled={!allAssigned}
                    className={`px-5 py-2 rounded-xl font-semibold shadow inline-flex items-center gap-2 ${
                      allAssigned ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Lihat Ringkasan <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-600" /> Partisipan</h3>
                {participants.length === 0 ? (
                  <Empty icon={Users} title="Kosong" desc="Tambah partisipan dulu." />
                ) : (
                  <div className="space-y-2">
                    {participants.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                        <div className="truncate">
                          <div className="text-sm font-semibold text-slate-800 truncate">{p.user?.name || p.user?.username}</div>
                          <div className="text-xs text-slate-500">ID: {p.user?.id}</div>
                        </div>
                        <button onClick={() => removeParticipant(p)} className="p-2 rounded-lg hover:bg-rose-50 text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Wallet className="w-5 h-5 text-emerald-600" /> Ringkasan Pembagian</h2>
                <div className="text-sm text-slate-500">{receipt?.store_name} • {new Date(receipt?.date || Date.now()).toLocaleDateString("id-ID")}</div>
              </div>
              {!summary ? (
                <Empty icon={Wallet} title="Belum ada ringkasan" desc="Klik tombol di langkah sebelumnya." />
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {summary.summary?.map((row, i) => (
                      <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="font-semibold text-slate-900 truncate">{row.user?.name}</div>
                        <div className="text-xs text-slate-500 mb-3">{row.percentage}% dari total</div>
                        <div className="text-sm flex items-center justify-between"><span className="text-slate-600">Subtotal</span><span className="font-semibold">{formatRupiah(row.items_total)}</span></div>
                        <div className="text-sm flex items-center justify-between"><span className="text-slate-600">Pajak</span><span className="font-semibold">{formatRupiah(row.tax_share)}</span></div>
                        <Divider />
                        <div className="text-base flex items-center justify-between mt-2"><span className="font-semibold text-slate-800">Total</span><span className="font-bold text-emerald-600">{formatRupiah(row.final_total)}</span></div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-900">Ringkasan Struk</div>
                      <div className="text-sm text-slate-600">Total: <span className="font-semibold">{formatRupiah(summary.receipt?.total || 0)}</span></div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button onClick={() => setStep(3)} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700">Kembali</button>
                    <a href="/dashboard" className="px-5 py-2 rounded-xl font-semibold shadow bg-emerald-600 text-white inline-flex items-center gap-2">Selesai</a>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Cari Teman"
        footer={
          <div className="flex justify-end">
            <button onClick={() => setSearchOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700">Tutup</button>
          </div>
        }
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <input
              className="w-full rounded-xl p-3 pl-10 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ketik username teman…"
              value={searchQuery}
              onChange={(e) => searchFriends(e.target.value)}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        {searchResults.length === 0 ? (
          <Empty icon={Search} title="Tidak ada hasil" desc="Coba ketik username yang lain." />
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {searchResults.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 truncate">{u.name || u.username}</div>
                  <div className="text-xs text-slate-500">@{u.username}</div>
                </div>
                <button onClick={() => addParticipant(u)} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-sm font-medium">Tambah</button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-xl shadow-lg text-white ${
              toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
            }`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RSplitBill;
