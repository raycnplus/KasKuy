import { React, useEffect, useRef } from "react";
import { ChevronLeft, Search } from "lucide-react";
import gsap from "gsap";

const DaftarKas = () => {
    const containerRef = useRef(null);

    const dummyTransaksi = [
        {
            id: 1,
            kategori: "Hedon",
            tanggal: "30 Mei 2025",
            judul: "Perpisahan muncak bareng temen",
            deskripsi: "sewa villa dan barbeque-an sama anak kelas",
            emoji: "🎉",
            nominal: 900000,
            tipe: "kredit",
            tanggalGrup: "30 Januari",
        },
        {
            id: 2,
            kategori: "Gajian",
            tanggal: "30 Mei 2025",
            judul: "Bayaran freelance desain",
            deskripsi: "client dari fiverr",
            emoji: "💸",
            nominal: 1200000,
            tipe: "debit",
            tanggalGrup: "30 Januari",
        },
        {
            id: 3,
            kategori: "Makan",
            tanggal: "29 Mei 2025",
            judul: "Ngopi di Starbucks",
            deskripsi: "sama temen sekelas",
            emoji: "☕",
            nominal: 45000,
            tipe: "kredit",
            tanggalGrup: "29 Januari",
        },
        {
            id: 4,
            kategori: "Transfer",
            tanggal: "29 Mei 2025",
            judul: "Transfer dari orang tua",
            deskripsi: "buat bayar kost dan makan",
            emoji: "🏦",
            nominal: 1500000,
            tipe: "debit",
            tanggalGrup: "29 Januari",
        },
        {
            id: 5,
            kategori: "Belanja",
            tanggal: "28 Mei 2025",
            judul: "Shopee haul baju lebaran",
            deskripsi: "diskon 5.5 gratis ongkir",
            emoji: "🛍️",
            nominal: 270000,
            tipe: "kredit",
            tanggalGrup: "28 Januari",
        },
        {
            id: 6,
            kategori: "Investasi",
            tanggal: "28 Mei 2025",
            judul: "Top up Reksadana",
            deskripsi: "buat masa depan",
            emoji: "📈",
            nominal: 300000,
            tipe: "debit",
            tanggalGrup: "28 Januari",
        },
        {
            id: 7,
            kategori: "Transportasi",
            tanggal: "27 Mei 2025",
            judul: "Isi bensin",
            deskripsi: "motor matic full tank",
            emoji: "⛽",
            nominal: 40000,
            tipe: "kredit",
            tanggalGrup: "27 Januari",
        },
        {
            id: 8,
            kategori: "Makan",
            tanggal: "27 Mei 2025",
            judul: "Sarapan nasi uduk",
            deskripsi: "pakai telur dan kerupuk",
            emoji: "🍳",
            nominal: 15000,
            tipe: "kredit",
            tanggalGrup: "27 Januari",
        },
        {
            id: 9,
            kategori: "Bonus",
            tanggal: "26 Mei 2025",
            judul: "Bonus proyek kampus",
            deskripsi: "presentasi sukses 💯",
            emoji: "🏆",
            nominal: 500000,
            tipe: "debit",
            tanggalGrup: "26 Januari",
        },
        {
            id: 10,
            kategori: "Hiburan",
            tanggal: "26 Mei 2025",
            judul: "Nonton film di bioskop",
            deskripsi: "film action bareng temen",
            emoji: "🎬",
            nominal: 65000,
            tipe: "kredit",
            tanggalGrup: "26 Januari",
        },
        {
            id: 11,
            kategori: "Cicilan",
            tanggal: "25 Mei 2025",
            judul: "Bayar cicilan laptop",
            deskripsi: "cicilan bulan ke-3",
            emoji: "💻",
            nominal: 800000,
            tipe: "kredit",
            tanggalGrup: "25 Januari",
        },
        {
            id: 12,
            kategori: "Uang Masuk",
            tanggal: "25 Mei 2025",
            judul: "THR dari om",
            deskripsi: "terima kasih om 😄",
            emoji: "🧧",
            nominal: 250000,
            tipe: "debit",
            tanggalGrup: "25 Januari",
        },
    ];

        useEffect(() => {
        gsap.from(containerRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out",
        });
    }, []);

    const groupByTanggal = dummyTransaksi.reduce((acc, item) => {
        if (!acc[item.tanggalGrup]) {
            acc[item.tanggalGrup] = [];
        }
        acc[item.tanggalGrup].push(item);
        return acc;
    }, {});

    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 text-pink-500/80 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-pink-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
            </div>

            <div className="p-7" ref={containerRef}>
                <div className="flex items-center gap-x-1 sm:gap-x-1">
                    <a href="/dashboard">
                        <ChevronLeft className="w-8 h-8 text-pink-500 hover:text-pink-700 cursor-pointer" />
                    </a>
                    <div className="font-medium text-3xl">
                        Riwayat Transaksi
                    </div>
                </div>
                <form action="" className="mt-6">
                    <div className="flex w-full gap-3 mb-4">
                        <div className="relative flex items-center basis-2/3 min-w-0">
                            <input
                                className="w-full rounded-xl p-3 pl-4 pr-12 bg-white placeholder:text-gray-400 font-medium"
                                placeholder="Cari sesuatu disini..."
                            />
                            <Search className="absolute right-4 text-gray-400 w-5 h-5" />
                        </div>
                        <div className="relative basis-1/9 min-w-0">
                            <select className="w-full rounded-xl p-3 pl-4 pr-8 bg-white text-gray-700 font-medium appearance-none focus:outline-none">
                                <option value="">Kategori</option>
                                <option value="makan">Makan</option>
                                <option value="minum">Minum</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                &#9662;
                            </span>
                        </div>
                        <div className="relative basis-1/9 min-w-0">
                            <select className="w-full rounded-xl p-3 pl-4 pr-8 bg-white text-gray-700 font-medium appearance-none focus:outline-none">
                                <option value="">Tipe</option>
                                <option value="debit">Pemasukan</option>
                                <option value="kredit">Pengeluaran</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                &#9662;
                            </span>
                        </div>
                        <div className="relative basis-1/9 min-w-0">
                            <select className="w-full rounded-xl p-3 pl-4 pr-8 bg-white text-gray-700 font-medium appearance-none focus:outline-none">
                                <option value="">Urutkan</option>
                                <option value="terbaru">Terbaru</option>
                                <option value="terlama">Terlama</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                &#9662;
                            </span>
                        </div>
                    </div>
                </form>

                {Object.entries(groupByTanggal).map(([tanggal, items]) => (
                    <div key={tanggal} className="mt-6">
                        <h2 className="text-4xl text-black font-medium">
                            {tanggal}
                        </h2>
                        <div className="space-y-3 mt-2">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-white/40 border-2 border-white/20 backdrop-blur-xl rounded-3xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 to-pink-600/80 rounded-2xl flex items-center justify-center">
                                            <span className="text-xl sm:text-3xl lg:text-4xl">
                                                {item.emoji}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 truncate">
                                                {item.judul}
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-500">
                                                {item.kategori} - {item.tanggal}
                                            </div>
                                            <div className="text-xs text-gray-400 hidden sm:block">
                                                {item.deskripsi}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`${
                                            item.tipe === "debit"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        } font-semibold text-lg sm:text-2xl lg:text-3xl ml-2`}
                                    >
                                        Rp.{" "}
                                        {item.nominal.toLocaleString("id-ID")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DaftarKas;
