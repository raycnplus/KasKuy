import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  Search,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import BackButton from "../../components/lainnya/BackButton";

const Chip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-semibold transition border ${
      active
        ? "bg-emerald-600 text-white border-emerald-600 shadow"
        : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
    }`}
  >
    {children}
  </button>
);

const Avatar = ({ name }) => {
  const label = useMemo(() => {
    const n = String(name || "?").trim();
    if (!n) return "?";
    const parts = n.split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [name]);
  return (
    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold grid place-items-center">
      {label}
    </div>
  );
};

const Toast = ({ toast, onClose }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-xl shadow-lg text-white ${
          toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
        }`}
        onClick={onClose}
      >
        {toast.text}
      </motion.div>
    )}
  </AnimatePresence>
);

const RFriends = () => {
  const [tab, setTab] = useState("search");
  const [me, setMe] = useState(null);

  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const [incoming, setIncoming] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loadingIncoming, setLoadingIncoming] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(true);

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 2200);
  };

  const formatName = (u) => u?.name || u?.username || "User";

  const loadProfile = async () => {
    try {
      const { data } = await api.get("/profile");
      setMe(data?.data || null);
    } catch {}
  };

  const doSearch = async (keyword) => {
    setQ(keyword);
    if (!keyword) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const { data } = await api.get("/search", { params: { query: keyword } });
      setResults(Array.isArray(data) ? data : data?.data || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const loadIncoming = async () => {
    setLoadingIncoming(true);
    try {
      const { data } = await api.get("/friend-requests/incoming");
      setIncoming(data || []);
    } catch {
      setIncoming([]);
    } finally {
      setLoadingIncoming(false);
    }
  };

  const loadFriends = async () => {
    setLoadingFriends(true);
    try {
      const { data } = await api.get("/friends");
      setFriends(data || []);
    } catch {
      setFriends([]);
    } finally {
      setLoadingFriends(false);
    }
  };

  const sendRequest = async (username) => {
    if (!username) return;
    setBusy(true);
    try {
      await api.post("/friend-request", { friend_username: username });
      showToast("success", "Permintaan terkirim");
      setResults((r) =>
        r.map((u) => (u.username === username ? { ...u, __requested: true } : u))
      );
      await loadIncoming();
    } catch (e) {
      showToast("error", e?.response?.data?.message || "Gagal mengirim permintaan");
    } finally {
      setBusy(false);
    }
  };

  const respond = async (username, action) => {
    setBusy(true);
    try {
      await api.post("/friend-request/respond", { username, action });
      showToast("success", action === "accepted" ? "Teman ditambahkan" : "Permintaan ditolak");
      await Promise.all([loadIncoming(), loadFriends()]);
    } catch (e) {
      showToast("error", e?.response?.data?.message || "Gagal memproses");
    } finally {
      setBusy(false);
    }
  };

  const removeFriend = async (username) => {
    if (!username) return;
    const ok = window.confirm(`Hapus pertemanan dengan @${username}?`);
    if (!ok) return;
    setBusy(true);
    try {
      await api.delete(`/friends/${username}`);
      showToast("success", "Pertemanan dihapus");
      await loadFriends();
    } catch (e) {
      showToast("error", e?.response?.data?.message || "Gagal menghapus");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadIncoming();
    loadFriends();
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
            <BackButton />
            <h1 className="text-xl sm:text-2xl font-semibold">Teman</h1>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/30 shadow-lg">
          <div className="flex flex-wrap gap-2">
            <Chip active={tab === "search"} onClick={() => setTab("search")}>
              <div className="flex items-center gap-2"><Search className="w-4 h-4" /> Cari Teman</div>
            </Chip>
            <Chip active={tab === "incoming"} onClick={() => setTab("incoming")}>
              <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Permintaan Masuk</div>
            </Chip>
            <Chip active={tab === "friends"} onClick={() => setTab("friends")}>
              <div className="flex items-center gap-2"><UserCheck className="w-4 h-4" /> Daftar Teman</div>
            </Chip>
          </div>
        </div>

        {tab === "search" && (
          <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/30 shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-5">
                <h2 className="text-lg font-bold text-slate-900">Cari Teman</h2>
                <p className="text-sm text-slate-600 mt-1">Masukkan username, lalu kirim permintaan pertemanan.</p>
              </div>
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => doSearch(e.target.value)}
                  placeholder="ketik username…"
                  className="w-full rounded-2xl p-4 pl-12 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                {searching && (
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600 absolute right-4 top-1/2 -translate-y-1/2" />
                )}
              </div>

              <div className="mt-6 space-y-2">
                {results.length === 0 ? (
                  <div className="text-center text-slate-500 text-sm">Tidak ada hasil.</div>
                ) : (
                  results.map((u) => (
                    <div key={u.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={formatName(u)} />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 truncate">{formatName(u)}</div>
                          <div className="text-xs text-slate-500 truncate">@{u.username}</div>
                        </div>
                      </div>
                      {me && u.username === me.username ? (
                        <span className="text-xs text-slate-400">Itu kamu</span>
                      ) : (
                        <button
                          disabled={busy || u.__requested}
                          onClick={() => sendRequest(u.username)}
                          className={`px-3 py-1.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 ${
                            u.__requested
                              ? "bg-slate-100 text-slate-500"
                              : "bg-emerald-600 text-white hover:brightness-105"
                          }`}
                        >
                          {u.__requested ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                          {u.__requested ? "Terkirim" : "Tambah"}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "incoming" && (
          <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/30 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Permintaan Masuk</h2>
            </div>
            {loadingIncoming ? (
              <div className="text-sm text-slate-500">Memuat…</div>
            ) : incoming.length === 0 ? (
              <div className="text-sm text-slate-500">Tidak ada permintaan.</div>
            ) : (
              <div className="space-y-2">
                {incoming.map((req) => (
                  <div key={req.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={formatName(req.user)} />
                      <div>
                        <div className="font-semibold text-slate-800">{formatName(req.user)}</div>
                        <div className="text-xs text-slate-500">@{req.user?.username}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={busy}
                        onClick={() => respond(req.user?.username, "accepted")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold inline-flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" /> Terima
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => respond(req.user?.username, "rejected")}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-sm font-semibold inline-flex items-center gap-2"
                      >
                        <X className="w-4 h-4" /> Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "friends" && (
          <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/30 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Daftar Teman</h2>
            </div>
            {loadingFriends ? (
              <div className="text-sm text-slate-500">Memuat…</div>
            ) : friends.length === 0 ? (
              <div className="text-sm text-slate-500">Belum ada teman. Coba kirim permintaan di tab Cari Teman.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {friends.map((f) => {
                  const other = f.user?.username === me?.username ? f.friend : f.user;
                  return (
                    <div key={f.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={formatName(other)} />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 truncate">{formatName(other)}</div>
                          <div className="text-xs text-slate-500 truncate">@{other?.username}</div>
                        </div>
                      </div>
                      <button
                        disabled={busy}
                        onClick={() => removeFriend(other?.username)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-sm font-semibold inline-flex items-center gap-2 hover:bg-rose-100"
                      >
                        <UserMinus className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default RFriends;
