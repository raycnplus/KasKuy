import React from "react";
import {
    NotebookPen,
    Notebook,
    BarChart3,
    ReceiptText,
    ArrowDownRight,
    ArrowUpRight,
    EyeOff,
} from "lucide-react";

const Dashboard = () => {
    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-pink-400 to-pink-600 text-pink-500/80 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-pink-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
            </div>

            <div className="p-4 sm:p-7 pb-32 sm:pb-32">
                {/* User header */}
                <div className="w-max max-w-60 h-relative bg-white/50 p-3 sm:p-5 flex items-center gap-x-3 sm:gap-x-6 rounded-2xl">
                    <div className="w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm sm:text-lg">👤</span>
                    </div>
                    <p className="font-semibold text-xl sm:text-3xl">Fardhan</p>
                </div>
                <div className="mt-[30px] sm:mt-[40px] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0">
                    <div>
                        <p className="text-white text-2xl sm:text-4xl">
                            Sisa uang kamu
                        </p>
                        <div className="flex items-center mt-3 flex-wrap">
                            <h1 className="text-white font-semibold text-5xl sm:text-6xl lg:text-8xl">
                                Rp.500.000
                            </h1>
                            <EyeOff className="ml-2 sm:ml-4 w-6 h-6 sm:w-12 sm:h-12 text-white" />
                        </div>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-white/70 to-white/80 border-2 border-grey-300 backdrop-blur-xl w-full p-4 sm:p-5 rounded-2xl lg:rounded-3xl">
                            <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-green-500 flex items-center justify-center">
                                    <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <p className="text-md sm:text-lg lg:text-xl font-semibold text-black">
                                    Pengeluaran
                                </p>
                            </div>
                            <h2 className="text-xl sm:text-2xl lg:text-4xl text-black font-medium lg:mt-4">
                                Rp. 500.000
                            </h2>
                            <p className="text-xs sm:text-sm lg:text-sm text-green-500 mt-1 lg:mt-3">
                                Naik 50% dari bulan lalu
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-white/70 to-white/80 border-2 border-grey-300 backdrop-blur-xl w-full p-4 sm:p-5 rounded-2xl lg:rounded-3xl">
                            <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-500 flex items-center justify-center">
                                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <p className="text-md sm:text-lg lg:text-xl font-semibold text-black">
                                    Pemasukan
                                </p>
                            </div>
                            <h2 className="text-xl sm:text-2xl lg:text-4xl text-black font-medium lg:mt-4">
                                Rp. 500.000
                            </h2>
                            <p className="text-xs sm:text-sm lg:text-sm text-red-500 mt-1 lg:mt-3">
                                Naik 50% dari bulan lalu
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom panel */}
            <div
                className="w-screen bg-white/70 border-2 border-white backdrop-blur-xl rounded-t-3xl p-4 sm:p-10 flex flex-col lg:flex-row md:h-[350px] lg:h-[450px] lg:absolute lg:bottom-0"
            >
                {/* Action buttons */}
                <div className="w-full lg:w-1/4 mb-6 lg:mb-0 flex justify-center lg:justify-center gap-10">
                    <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-4 lg:gap-8 place-items-center">
                        <a href="/catat" className="flex flex-col items-center">
                            <div className="bg-white/90 backdrop-blur-xl hover:bg-white/70 active:scale-95 transition ease-in-out duration-300 h-[65px] w-[65px] sm:h-[100px] sm:w-[100px] lg:h-[120px] lg:w-[120px] rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-5 flex justify-center items-center mb-1">
                                <NotebookPen className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] lg:w-[70px] lg:h-[70px]" />
                            </div>
                            <h1 className="text-center w-[80px] sm:w-[100px] text-xs sm:text-base lg:text-lg font-medium">
                                Catat
                            </h1>
                        </a>
                        <a href="/DaftarKas" className="flex flex-col items-center">
                            <div className="bg-white/90 backdrop-blur-xl hover:bg-white/70 active:scale-95 transition ease-in-out duration-300 h-[65px] w-[65px] sm:h-[100px] sm:w-[100px] lg:h-[120px] lg:w-[120px] rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-5 flex justify-center items-center mb-1">
                                <Notebook className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] lg:w-[70px] lg:h-[70px]" />
                            </div>
                            <h1 className="text-center w-[80px] sm:w-[100px] text-xs sm:text-base lg:text-lg font-medium">
                                Daftar Kas
                            </h1>
                        </a>
                        <a href="/catat" className="flex flex-col items-center">
                            <div className="bg-white/90 backdrop-blur-xl hover:bg-white/70 active:scale-95 transition ease-in-out duration-300 h-[65px] w-[65px] sm:h-[100px] sm:w-[100px] lg:h-[120px] lg:w-[120px] rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-5 flex justify-center items-center mb-1">
                                <BarChart3 className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] lg:w-[70px] lg:h-[70px]" />
                            </div>
                            <h1 className="text-center w-[80px] sm:w-[100px] text-xs sm:text-base lg:text-lg font-medium">
                                Analitik
                            </h1>
                        </a>
                        <a href="/catat" className="flex flex-col items-center">
                            <div className="bg-white/90 backdrop-blur-xl hover:bg-white/70 active:scale-95 transition ease-in-out duration-300 h-[65px] w-[65px] sm:h-[100px] sm:w-[100px] lg:h-[120px] lg:w-[120px] rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-5 flex justify-center items-center mb-1">
                                <ReceiptText className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] lg:w-[70px] lg:h-[70px]" />
                            </div>
                            <h1 className="text-center w-[80px] sm:w-[100px] text-xs sm:text-base lg:text-lg font-medium">
                                Split Bill
                            </h1>
                        </a>
                    </div>
                </div>

                {/* Divider - hidden on mobile */}
                <div className="hidden lg:block w-1 bg-pink-300/80 rounded-full mx-4"></div>

                {/* Transactions section */}
                <div className="flex-1 lg:pl-6 flex flex-col">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                        Transaksi Terakhir
                    </h2>
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <div className="space-y-3 pr-2">
                            <div className="flex items-center justify-between p-3 bg-white/40 border-2 border-white/20 backdrop-blur-xl rounded-3xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 to-pink-600/80 rounded-2xl flex items-center justify-center">
                                        <span className="text-xl sm:text-3xl lg:text-4xl">
                                            😴
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 truncate">
                                            Perpisahan muncak bareng temen
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            Hedon - 30 Mei 2025
                                        </div>
                                        <div className="text-xs text-gray-400 hidden sm:block">
                                            sewa villa dan barbeque-an sama anak
                                            kelas
                                        </div>
                                    </div>
                                </div>
                                <div className="text-red-500 font-semibold text-lg sm:text-2xl lg:text-3xl ml-2">
                                    Rp. 900k
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/40 border-2 border-white/20 backdrop-blur-xl rounded-3xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 to-pink-600/80 rounded-2xl flex items-center justify-center">
                                        <span className="text-xl sm:text-3xl lg:text-4xl">
                                            🍽️
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 truncate">
                                            Fine Dining di The Garden Osteria
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            Makan - 30 Mei 2025
                                        </div>
                                        <div className="text-xs text-gray-400 hidden sm:block">
                                            Self Rewards
                                        </div>
                                    </div>
                                </div>
                                <div className="text-red-500 font-semibold text-lg sm:text-2xl lg:text-3xl ml-2">
                                    Rp. 3.5M
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/40 border-2 border-white/20 backdrop-blur-xl rounded-3xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 to-pink-600/80 rounded-2xl flex items-center justify-center">
                                        <span className="text-xl sm:text-3xl lg:text-4xl">
                                            🤑
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 truncate">
                                            Gaji Bulanan
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            Gaji - 30 Mei 2025
                                        </div>
                                        <div className="text-xs text-gray-400 hidden sm:block">
                                            Caiir!!
                                        </div>
                                    </div>
                                </div>
                                <div className="text-green-500 font-semibold text-lg sm:text-2xl lg:text-3xl ml-2">
                                    Rp. 5.5M
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/40 border-2 border-white/20 backdrop-blur-xl rounded-3xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 to-pink-600/80 rounded-2xl flex items-center justify-center">
                                        <span className="text-xl sm:text-3xl lg:text-4xl">
                                            ☕
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 truncate">
                                            Kopi pagi di cafe favorit
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            Minum - 29 Mei 2025
                                        </div>
                                        <div className="text-xs text-gray-400 hidden sm:block">
                                            Daily fuel
                                        </div>
                                    </div>
                                </div>
                                <div className="text-red-500 font-semibold text-lg sm:text-2xl lg:text-3xl ml-2">
                                    Rp. 45k
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/40 border-2 border-white/20 backdrop-blur-xl rounded-3xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 to-pink-600/80 rounded-2xl flex items-center justify-center">
                                        <span className="text-xl sm:text-3xl lg:text-4xl">
                                            🛒
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 truncate">
                                            Belanja bulanan
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            Grocery - 28 Mei 2025
                                        </div>
                                        <div className="text-xs text-gray-400 hidden sm:block">
                                            Kebutuhan rumah tangga
                                        </div>
                                    </div>
                                </div>
                                <div className="text-red-500 font-semibold text-lg sm:text-2xl lg:text-3xl ml-2">
                                    Rp. 750k
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/40 border-2 border-white/20 backdrop-blur-xl rounded-3xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 to-pink-600/80 rounded-2xl flex items-center justify-center">
                                        <span className="text-xl sm:text-3xl lg:text-4xl">
                                            🎬
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 truncate">
                                            Nonton bioskop weekend
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            Entertainment - 27 Mei 2025
                                        </div>
                                        <div className="text-xs text-gray-400 hidden sm:block">
                                            Me time
                                        </div>
                                    </div>
                                </div>
                                <div className="text-red-500 font-semibold text-lg sm:text-2xl lg:text-3xl ml-2">
                                    Rp. 75k
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
