import React, { useEffect, useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import FeedbackStackCards from "../components/lainnya/FeedbackStackCards.jsx";
import "../../css/app.css";
import preview from "../../../public/img/page2.png";
import preview2 from "../../../public/img/page1.png";
import SupportedBy from "../components/lainnya/SupportedBy.jsx";
import GridLines from "../components/gridot.jsx";
import Split from "../components/split.jsx";
import Magnet from "../components/magnet.jsx";
import LPJoin from "../components/buttons/LPJoin.jsx";
import Tablet from "../components/Tablet.jsx";
import Tabletnomove from "../components/Tabletnomove.jsx";
import Navbar from "../components/lainnya/Navbar.jsx";
import Footer from "../components/lainnya/Footer.jsx";
import AccordionFAQ from "../components/lainnya/AccordionFAQ.jsx";
const sampleFeedbacks = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Customer",
        message:
            "Pelayanan yang luar biasa! Sangat puas dengan produk yang diberikan. Akan merekomendasikan kepada teman-teman.",
        rating: 5,
    },
    {
        id: 2,
        name: "Ahmad Rizki",
        role: "Business Owner",
        message:
            "Kualitas produk sangat baik dan sesuai dengan harapan. Tim sangat responsif dan profesional.",
        rating: 5,
    },
    {
        id: 3,
        name: "Maria Santos",
        role: "Designer",
        message:
            "Pengalaman berbelanja yang menyenangkan. Produk berkualitas tinggi dengan harga yang reasonable.",
        rating: 4,
    },
    {
        id: 4,
        name: "David Chen",
        role: "Developer",
        message:
            "Sangat impressed dengan kecepatan delivery dan packaging yang rapi. Definitely will order again!",
        rating: 5,
    },
    {
        id: 5,
        name: "Lisa Anderson",
        role: "Manager",
        message:
            "Customer service yang excellent dan produk yang sesuai dengan deskripsi. Highly recommended!",
        rating: 5,
    },
    {
        id: 6,
        name: "Budi Santoso",
        role: "Entrepreneur",
        message:
            "Aplikasi yang membantu sekali untuk mengatur keuangan bisnis. Interface yang user-friendly dan fitur lengkap.",
        rating: 5,
    },
    {
        id: 7,
        name: "Nina Putri",
        role: "Freelancer",
        message:
            "Produknya memudahkan pekerjaan saya sehari-hari. Desainnya menarik dan mudah digunakan.",
        rating: 4,
    },
    {
        id: 8,
        name: "Kevin Hartanto",
        role: "Student",
        message:
            "Cocok untuk penggunaan sehari-hari. Fitur-fiturnya bermanfaat dan interface intuitif.",
        rating: 4,
    },
    {
        id: 9,
        name: "Indra Perdana",
        role: "Tech Enthusiast",
        message:
            "Solusi terbaik untuk kebutuhan teknologi. Performa stabil dan cepat. Saya sangat puas!",
        rating: 5,
    },
    {
        id: 10,
        name: "Tia Rahmawati",
        role: "Content Creator",
        message:
            "Desain antarmuka yang cantik dan mudah disesuaikan. Membantu meningkatkan kreativitas saya.",
        rating: 5,
    },
];

const faqItems = [
  {
    question: "Bagaimana cara mendaftar di Kaskuy?",
    answer: "Untuk mendaftar di Kaskuy, klik tombol 'Daftar' di halaman utama, lalu lengkapi formulir dengan nama lengkap, nomor telepon, dan kata sandi. Setelah akun aktif, Anda bisa langsung mulai mencatat pemasukan dan pengeluaran, atau membuat kategori anggaran sesuai kebutuhan."
  },
  {
    question: "Apakah Kaskuy bisa diakses melalui perangkat mobile?",
    answer: "Ya, Kaskuy dirancang responsif dan kompatibel dengan smartphone serta tablet berbasis Android dan iOS. Anda bisa mengakses aplikasi melalui browser atau menggunakan aplikasi mobile (jika tersedia) untuk memantau transaksi, mengelola anggaran, atau melihat laporan keuangan kapan saja."
  },
  {
    question: "Apa manfaat menggunakan Kaskuy bagi pengelolaan keuangan?",
    answer: "Kaskuy membantu Anda mencatat transaksi secara real-time, mengelola anggaran bulanan, dan menganalisis pola pengeluaran. Fitur laporan bulanan dan notifikasi pengeluaran berlebihan memudahkan pengendalian keuangan pribadi atau kelompok secara efektif."
  },
  {
    question: "Bagaimana jika saya ingin mengubah kategori transaksi atau anggaran?",
    answer: "Anda dapat mengedit kategori transaksi atau anggaran langsung di menu 'Pengaturan'. Semua perubahan akan tercatat secara otomatis, dan riwayat transaksi lama tetap tersimpan untuk referensi analisis keuangan."
  },
  {
    question: "Bagaimana Kaskuy memastikan keamanan data keuangan pengguna?",
    answer: "Kaskuy menggunakan enkripsi SSL/TLS untuk melindungi data transaksi dan autentikasi dua faktor (2FA) untuk keamanan akun. Data disimpan di server terpusat dengan cadangan berkala, serta akses terbatas hanya untuk pengguna terotorisasi."
  }
];

const LandingPage = () => {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 text-pink-500/80 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-pink-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 px-4 sm:px-6">
                <Navbar />
                <section className="max-w-7xl mx-auto mt-8 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                        <div className="space-y-4">
                            <Split
                                text="Catat seluruh keuanganmu dengan sekali klik pakai Kaskuy"
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl font-bold text-pink-600 leading-tight text-center lg:text-left"
                                delay={30}
                                duration={0.6}
                                ease="power3.out"
                                splitType="chars"
                                from={{ opacity: 0, y: 40 }}
                                to={{ opacity: 1, y: 0 }}
                                threshold={0.1}
                                rootMargin="-100px"
                                textAlign="left"
                            />

                            <Split
                                text="Pantau pengeluaran dan tabunganmu secara real-time. Kaskuy bantu kamu lebih bijak soal duit."
                                className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl text-pink-500/80 leading-relaxed text-center lg:text-left"
                                delay={10}
                                duration={0.6}
                                ease="power3.out"
                                splitType="words"
                                from={{ opacity: 0, y: 40 }}
                                to={{ opacity: 1, y: 0 }}
                                threshold={0.1}
                                rootMargin="-100px"
                                textAlign="left"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                            <span className="px-3 sm:px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-xs sm:text-sm font-medium">
                                ✨ Mudah digunakan
                            </span>
                            <span className="px-3 sm:px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-xs sm:text-sm font-medium">
                                🔒 Aman & Terpercaya
                            </span>
                            <span className="px-3 sm:px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-xs sm:text-sm font-medium">
                                📱 Mobile Friendly
                            </span>
                        </div>
                        {/* CTA */}
                        <div
                            className="space-y-2 text-center lg:text-left"
                            id="join"
                        >
                            <LPJoin onLearnMoreClick={scrollToFeatures}/>
                            <p className="text-xs sm:text-sm">
                                ⭐⭐⭐⭐⭐ 4.5/5 Di PlayStore
                            </p>
                            <p className="text-xs sm:text-sm">
                                10,000+ downloads
                            </p>
                        </div>
                    </div>
                    <div className="relative order-1 lg:order-2">
                        <div className="relative z-10 flex justify-center">
                            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full">
                                <Tablet src={preview} />
                            </div>
                        </div>

                        {/* Background decorations */}
                        <div className="absolute -top-5 sm:-top-10 -right-5 sm:-right-10 w-10 sm:w-20 h-10 sm:h-20 bg-pink-300/30 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-5 sm:-bottom-10 -left-5 sm:-left-10 w-16 sm:w-32 h-16 sm:h-32 bg-pink-200/40 rounded-full blur-xl"></div>
                    </div>
                </section>

                {/* Supported by */}
                <div className="mt-12 sm:mt-16 lg:mt-20">
                    <SupportedBy />
                </div>

                {/* Feature section */}
                <div className="mt-12 sm:mt-16 lg:mt-20" ref={featuresRef} id="features">
                    <div className="w-full bg-white/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                            <div className="order-2 lg:order-1 flex justify-center">
                                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full">
                                    <Tablet src={preview2} />
                                </div>
                            </div>
                            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2 text-center lg:text-left">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-pink-600 leading-tight">
                                    Catat keuanganmu makin mudah dengan adanya
                                    kategori transaksi
                                </h1>
                                <p className="text-sm sm:text-base lg:text-lg text-pink-500/80 leading-relaxed">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Expedita error eaque
                                    labore quas nostrum nemo tenetur hic
                                    recusandae accusantium, doloribus neque
                                    molestiae ad autem illo omnis voluptas
                                    aliquid. Corrupti corporis necessitatibus
                                    non ducimus illum doloribus!
                                </p>
                                <button className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-md bg-gradient-to-b from-pink-400 to-pink-600 text-white transition-all duration-300 ease-out group cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <div className="relative h-[24px] sm:h-[28px] w-[100px] leading-[24px] sm:leading-[28px] overflow-hidden">
                                            <span className="absolute inset-0 flex items-center justify-start text-sm sm:text-base font-medium transition-all duration-400 ease-in-out">
                                                Pelajari Fitur
                                            </span>
                                        </div>
                                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300 text-white-600 group-hover:text-white-700" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 sm:p-10 h-full">
                            <Tabletnomove src={preview} />
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-pink-600 mt-5">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit.
                            </h1>
                            <p className="text-sm sm:text-base lg:text-md mt-2 text-pink-500/80 leading-relaxed">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Expedita error eaque labore
                                quas nostrum nemo tenetur hic recusandae
                                accusantium, doloribus neque molestiae ad autem
                                illo omnis voluptas aliquid. Corrupti corporis
                                necessitatibus non ducimus illum doloribus!
                            </p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 sm:p-10 h-full">
                            <Tabletnomove src={preview} />
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-pink-600 mt-5">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit.
                            </h1>
                            <p className="text-sm sm:text-base lg:text-md mt-2 text-pink-500/80 leading-relaxed">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Expedita error eaque labore
                                quas nostrum nemo tenetur hic recusandae
                                accusantium, doloribus neque molestiae ad autem
                                illo omnis voluptas aliquid. Corrupti corporis
                                necessitatibus non ducimus illum doloribus!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-9 sm:mt-13 lg:mt-15 w-full ">
                <div className="px-4 sm:px-6 mb-8">
                    <h1 className="text-center text-3xl sm:text-4xl font-semibold text-pink-600 mt-5">
                        Apa Kata Mereka?
                    </h1>
                    <FeedbackStackCards
                        className="custom-scattered-stack"
                        feedbacks={sampleFeedbacks}
                        containerWidth={window.innerWidth}
                        containerHeight={500}
                        animationDelay={0.3}
                        animationStagger={0.08}
                        enableHover={true}
                        cardWidth={260}
                        cardHeight={200}
                    />
                </div>
            </div>
            <div className="relative z-10 px-4 sm:px-6 mb-12">
                <h1 className="text-center text-3xl sm:text-4xl font-semibold text-pink-600 mb-6">
                    Frequently Asked Questions
                    </h1>
                <AccordionFAQ items={faqItems} />
            </div>
            <Footer />
        </div>
    );
}

export default LandingPage
