import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    Users,
    Tags,
    BellRing,
    Moon,
    Sun,
    Globe,
    Eye,
    EyeOff,
    Lock,
    LogOut,
    CheckCircle2,
    X,
    UserCircle2,
    CalendarDays,
    Camera,
    Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";

const Toggle = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full relative transition ${
            checked ? "bg-emerald-600" : "bg-slate-300"
        }`}
    >
        <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition ${
                checked ? "translate-x-5" : ""
            }`}
        />
    </button>
);

const Select = ({ value, onChange, children }) => (
    <select
        className="w-full rounded-xl p-3 pl-4 pr-10 bg-white/90 backdrop-blur-md text-slate-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-white/40"
        value={value}
        onChange={(e) => onChange(e.target.value)}
    >
        {children}
    </select>
);

const initials = (s) => {
    const t = String(s || "").trim();
    if (!t) return "?";
    const p = t.split(" ").filter(Boolean).slice(0, 2);
    return p
        .map((w) => w[0])
        .join("")
        .toUpperCase();
};

export default function Settings() {
    const nav = useNavigate();
    const [profile, setProfile] = useState(null);

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "system"
    );
    const [lang, setLang] = useState(localStorage.getItem("lang") || "id");
    const [notif, setNotif] = useState(localStorage.getItem("notif") === "1");

    const [showPw, setShowPw] = useState(false);
    const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
    const [loadingPw, setLoadingPw] = useState(false);

    const [toast, setToast] = useState(null);

    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileRef = useRef(null);
    const savedTheme = localStorage.getItem("theme") || "system";
    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark =
        savedTheme === "dark" || (savedTheme === "system" && prefersDark);
    const [uploading, setUploading] = useState(false);
    const showToast = (type, text) => {
        setToast({ type, text });
        setTimeout(() => setToast(null), 2200);
    };

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/profile");
                const p = data?.data || null;
                setProfile(p);
                const url = p?.profile_picture_url || null;
                if (url) setAvatarUrl(url);
            } catch {
                setProfile(null);
            }
        })();
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        if (theme === "dark") document.documentElement.classList.add("dark");
        else if (theme === "light")
            document.documentElement.classList.remove("dark");
        else {
            document.documentElement.classList.toggle(
                "dark",
                window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
            );
        }
    }, [theme]);

    useEffect(() => localStorage.setItem("lang", lang), [lang]);
    useEffect(() => localStorage.setItem("notif", notif ? "1" : "0"), [notif]);

    const canSubmitPw = useMemo(() => {
        return (
            pw.current &&
            pw.next.length >= 6 &&
            pw.next === pw.confirm &&
            !loadingPw
        );
    }, [pw, loadingPw]);

    const submitPassword = async () => {
        if (!canSubmitPw) return;
        setLoadingPw(true);
        try {
            await api.post("/change-password", {
                current_password: pw.current,
                new_password: pw.next,
                new_password_confirmation: pw.confirm,
            });
            setPw({ current: "", next: "", confirm: "" });
            showToast("success", "Password berhasil diubah");
        } catch (e) {
            const msg = e?.response?.data?.message || "Gagal mengubah password";
            showToast("error", msg);
        } finally {
            setLoadingPw(false);
        }
    };
    // fetch profile (existing)
    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/profile");
                setProfile(data?.data || null);
            } catch {
                setProfile(null);
            }
        })();
    }, []);

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch {}
        localStorage.removeItem("token");
        nav("/login", { replace: true });
    };

    const onPickAvatar = async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const valid =
            ["image/jpeg", "image/png", "image/jpg"].includes(f.type) &&
            f.size <= 2 * 1024 * 1024;
        if (!valid) {
            showToast("error", "Gunakan JPG/PNG ≤ 2MB");
            e.target.value = "";
            return;
        }
        setUploadingAvatar(true);
        try {
            const fd = new FormData();
            fd.append("profile_picture", f);
            const { data } = await api.post("/user/profile-picture", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const url = data?.profile_picture_url || null;
            if (url) setAvatarUrl(url);
            showToast("success", "Foto profil diperbarui");
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Gagal memperbarui foto";
            showToast("error", msg);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const avatar = (
        <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center overflow-hidden">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-xl sm:text-2xl font-bold">
                        {initials(profile?.name || profile?.username)}
                    </span>
                )}
            </div>
            <button
                onClick={() => fileRef.current?.click()}
                className="absolute -right-2 -bottom-2 p-2 rounded-xl bg-emerald-600 text-white shadow hover:brightness-110"
                disabled={uploadingAvatar}
            >
                {uploadingAvatar ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Camera className="w-4 h-4" />
                )}
            </button>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickAvatar}
            />
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 text-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -left-14 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl" />
            </div>

            <div className="p-4 sm:p-6 lg:p-8 relative z-10 max-w-7xl mx-auto pb-28">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-2">
                        <a href="/dashboard" className="inline-flex">
                            <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500 hover:text-emerald-600" />
                        </a>
                        <h1 className="text-xl sm:text-2xl font-semibold">
                            Pengaturan
                        </h1>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1.15fr,2fr] gap-6">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <label className="relative w-14 h-14 rounded-2xl overflow-hidden cursor-pointer bg-emerald-100 grid place-items-center">
                                    {profile?.profile_picture_url ? (
                                        <img
                                            src={profile.profile_picture_url}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserCircle2 className="w-8 h-8 text-emerald-700" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={onPickAvatar}
                                    />
                                    <span className="absolute bottom-0 left-0 right-0 text-[10px] text-white bg-emerald-600/80 text-center py-0.5">
                                        {uploading ? "..." : "Ubah"}
                                    </span>
                                </label>
                                <div className="min-w-0">
                                    <div className="text-slate-900 font-semibold text-lg truncate">
                                        {profile?.name || "Pengguna"}
                                    </div>
                                    <div className="text-slate-600 text-sm truncate">
                                        @{profile?.username || "username"}
                                    </div>
                                    <div className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                                        <CalendarDays className="w-3.5 h-3.5" />
                                        Bergabung{" "}
                                        {profile?.created_at
                                            ? new Date(
                                                  profile.created_at
                                              ).toLocaleDateString("id-ID")
                                            : "-"}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-2xl ring-1 ring-emerald-200/60 bg-emerald-50/70 p-3">
                                    <div className="text-emerald-700 font-semibold">
                                        Tema
                                    </div>
                                    <div className="text-emerald-600/80">
                                        {theme === "system"
                                            ? "Mengikuti Sistem"
                                            : theme === "dark"
                                            ? "Gelap"
                                            : "Terang"}
                                    </div>
                                </div>
                                <div className="rounded-2xl ring-1 ring-cyan-200/60 bg-cyan-50/70 p-3">
                                    <div className="text-cyan-700 font-semibold">
                                        Bahasa
                                    </div>
                                    <div className="text-cyan-600/80">
                                        Indonesia
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-2xl"
                        >
                            <h2 className="text-sm font-bold text-slate-900 mb-4">
                                Akses Cepat
                            </h2>
                            <div className="grid gap-3">
                                <Link
                                    to="/settings/friends"
                                    className="group flex items-center justify-between rounded-2xl p-4 border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 grid place-items-center">
                                            <Users className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800">
                                                Kelola Teman
                                            </div>
                                            <div className="text-xs text-slate-600">
                                                Tambah/kelola teman untuk split
                                                bill
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition">
                                        Buka
                                    </span>
                                </Link>

                                <Link
                                    to="/settings/category"
                                    className="group flex items-center justify-between rounded-2xl p-4 border border-cyan-200 bg-gradient-to-br from-cyan-50 to-sky-50 hover:from-cyan-100 hover:to-sky-100 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 grid place-items-center">
                                            <Tags className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800">
                                                Kelola Kategori
                                            </div>
                                            <div className="text-xs text-slate-600">
                                                Buat, edit, dan atur prioritas
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-cyan-600 font-medium opacity-0 group-hover:opacity-100 transition">
                                        Buka
                                    </span>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-2xl"
                        >
                            <h2 className="text-sm font-bold text-slate-900 mb-3">
                                Aksi Akun
                            </h2>
                            <button
                                onClick={logout}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow hover:brightness-105"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-2xl"
                        >
                            <h2 className="text-lg font-bold mb-5">
                                Preferensi
                            </h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Moon className="w-4 h-4" /> Tema
                                    </div>
                                    <Select value={theme} onChange={setTheme}>
                                        <option value="system">Sistem</option>
                                        <option value="light">Terang</option>
                                        <option value="dark">Gelap</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Globe className="w-4 h-4" /> Bahasa
                                    </div>
                                    <Select value={lang} onChange={setLang}>
                                        <option value="id">Indonesia</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <BellRing className="w-4 h-4" />{" "}
                                        Notifikasi
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Toggle
                                            checked={notif}
                                            onChange={setNotif}
                                        />
                                        <span className="text-sm text-slate-600">
                                            {notif ? "Aktif" : "Nonaktif"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-2xl"
                        >
                            <h2 className="text-lg font-bold mb-5">Keamanan</h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-slate-700">
                                        Password Saat Ini
                                    </div>
                                    <input
                                        type={showPw ? "text" : "password"}
                                        value={pw.current}
                                        onChange={(e) =>
                                            setPw((s) => ({
                                                ...s,
                                                current: e.target.value,
                                            }))
                                        }
                                        className="w-full rounded-xl p-3 bg-white/90 border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-slate-700">
                                        Password Baru
                                    </div>
                                    <input
                                        type={showPw ? "text" : "password"}
                                        value={pw.next}
                                        onChange={(e) =>
                                            setPw((s) => ({
                                                ...s,
                                                next: e.target.value,
                                            }))
                                        }
                                        className="w-full rounded-xl p-3 bg-white/90 border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Minimal 6 karakter"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-slate-700">
                                        Konfirmasi
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPw ? "text" : "password"}
                                            value={pw.confirm}
                                            onChange={(e) =>
                                                setPw((s) => ({
                                                    ...s,
                                                    confirm: e.target.value,
                                                }))
                                            }
                                            className="w-full rounded-xl p-3 bg-white/90 border border-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12"
                                            placeholder="Ulangi password"
                                        />
                                        <button
                                            onClick={() => setShowPw((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100"
                                        >
                                            {showPw ? (
                                                <EyeOff className="w-5 h-5 text-slate-500" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-slate-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={submitPassword}
                                    disabled={!canSubmitPw}
                                    className={`px-5 py-2 rounded-xl font-semibold shadow ${
                                        canSubmitPw
                                            ? "bg-emerald-600 text-white"
                                            : "bg-slate-200 text-slate-500 cursor-not-allowed"
                                    }`}
                                >
                                    {loadingPw ? "Menyimpan…" : "Ubah Password"}
                                </button>
                            </div>
                            <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
                                <div className="rounded-2xl ring-1 ring-slate-200 bg-slate-50 p-3 flex items-center gap-2 text-slate-700">
                                    <Lock className="w-4 h-4 text-emerald-600" />
                                    Gunakan password unik dan panjang
                                </div>
                                <div className="rounded-2xl ring-1 ring-slate-200 bg-slate-50 p-3 flex items-center gap-2 text-slate-700">
                                    <Sun className="w-4 h-4 text-emerald-600" />
                                    Mode gelap siap saat mata mulai “protes”
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className={`fixed top-5 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-xl shadow-lg text-white ${
                            toast.type === "success"
                                ? "bg-emerald-600"
                                : "bg-rose-600"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="font-medium">{toast.text}</span>
                            <button
                                onClick={() => setToast(null)}
                                className="p-1 rounded hover:bg-white/10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
