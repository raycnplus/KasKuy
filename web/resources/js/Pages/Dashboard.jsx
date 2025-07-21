import React from "react";
import fardhan  from "../../../public/img/fardan.jpg"
import {
    NotebookPen,
    Notebook,
    BarChart3,
    ReceiptText,
    ArrowDownRight,
    ArrowUpRight,
    EyeClosed,
} from "lucide-react";

const Dashboard = () => {
    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-pink-400 to-pink-600 text-pink-500/80 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-pink-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
            </div>

            <div className="p-7 pb-32">
                <div className="w-60 h-relative bg-white/50 p-5 grid grid-cols-2 rounded-3xl">
                    <img src={fardhan} className="w-[45px] h-[45px] rounded-full" />
                    <p className="font-semibold text-3xl flex justify-center items-center mr-10">
                        Fardhan
                    </p>
                </div>
                <div className="mt-[40px] grid grid-cols-2">
                    <div className="">
                        <p className="text-white text-4xl">Sisa uang kamu</p>
                        <div className="flex items-center mt-3">
                            <h1 className="text-white font-semibold text-8xl">
                                Rp.500.000
                            </h1>
                            <EyeClosed className="ml-4 w-12 h-12 text-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="bg-gradient-to-br from-white/70 to-white/80 border-2 border-grey-300 backdrop-blur-xl w-50 h-relative p-5 rounded-3xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
                                    <ArrowDownRight className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-xl font-semibold text-black">
                                    Pengeluaran
                                </p>
                            </div>
                            <h2 className="text-4xl text-black font-medium mt-4">
                                Rp. 500.000
                            </h2>
                            <p className="text-sm text-green-500 mt-3">
                                Naik 50% dari bulan lalu
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-white/70 to-white/80 border-2 border-grey-300 backdrop-blur-xl w-50 h-relative p-5 rounded-3xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center">
                                    <ArrowUpRight className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-xl font-semibold text-black">
                                    Pemasukan
                                </p>
                            </div>
                            <h2 className="text-4xl text-black font-medium mt-4">
                                Rp. 500.000
                            </h2>
                            <p className="text-sm text-red-500 mt-3">
                                Naik 50% dari bulan lalu
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-screen h-[450px] absolute bottom-0 bg-white/70 border-2 border-white backdrop-blur-xl rounded-t-3xl p-10 flex">
                <div className="w-1/3 h-full">
                    <div className="grid grid-cols-2 gap-2 justify-items-center items-center h-full">
                        <button className="flex flex-col items-center">
                            <div className="bg-white/90 backdrop-blur-xl hover:bg-white/70 active:scale-95 transition ease-in-out duration-300 h-[120px] w-[120px] rounded-3xl p-5 flex justify-center items-center mb-1">
                                <NotebookPen className="w-[70px] h-[70px]" />
                            </div>
                            <h1 className="text-center w-[100px] text-lg font-medium">
                                Catat
                            </h1>
                        </button>
                        <button className="flex flex-col items-center">
                            <div className="bg-white/90 backdrop-blur-xl hover:bg-white/70 active:scale-95 transition ease-in-out duration-300 h-[120px] w-[120px] rounded-3xl p-5 flex justify-center items-center mb-1">
                                <Notebook className="w-[70px] h-[70px]" />
                            </div>
                            <h1 className="text-center w-[100px] text-lg font-medium">
                                Daftar Kas
                            </h1>
                        </button>
                        <button className="flex flex-col items-center">
                            <div className="bg-white/90 backdrop-blur-xl hover:bg-white/70 active:scale-95 transition ease-in-out duration-300 h-[120px] w-[120px] rounded-3xl p-5 flex justify-center items-center mb-1">
                                <BarChart3 className="w-[70px] h-[70px]" />
                            </div>
                            <h1 className="text-center w-[100px] text-lg font-medium">
                                Analitik
                            </h1>
                        </button>
                        <button className="flex flex-col items-center">
                            <div className="bg-white/90 backdrop-blur-xl hover:bg-white/70 active:scale-95 transition ease-in-out duration-300 h-[120px] w-[120px] rounded-3xl p-5 flex justify-center items-center mb-1">
                                <ReceiptText className="w-[70px] h-[70px]" />
                            </div>
                            <h1 className="text-center w-[100px] text-lg font-medium">
                                Split Bill
                            </h1>
                        </button>
                    </div>
                </div>
                <div className="w-1 bg-pink-300/80 rounded-full mx-4"></div>
                <div className="flex-1 pl-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/40 border-2 border-white/20 backdrop-blur-xl rounded-3xl mt-3">
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600/80 rounded-2xl flex items-center justify-center">
                                    <span className="text-4xl">😴</span>
                                </div>
                                <div>
                                    <div className="text-lg font-medium text-gray-800">
                                        Perpisahan muncak bareng temen
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Hedon - 30 Mei 2025
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        sewa villa dan barbeque-an sama anak
                                        kelas
                                    </div>
                                </div>
                            </div>
                            <div className="text-red-500 font-semibold text-3xl mr-3 ">
                                Rp. 900.000
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/40 border-2 border-white/20 backdrop-blur-xl rounded-3xl">
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600/80 rounded-2xl flex items-center justify-center">
                                    <span className="text-4xl">🍽️</span>
                                </div>
                                <div>
                                    <div className="text-lg font-medium text-gray-800">
                                        Fine Dining di The Garden Osteria
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Makan - 30 Mei 2025
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Self Rewards
                                    </div>
                                </div>
                            </div>
                            <div className="text-red-500 font-semibold text-3xl mr-3 ">
                                Rp. 3.500.000
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/40 border-2 border-white/20 backdrop-blur-xl rounded-3xl">
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600/80 rounded-2xl flex items-center justify-center">
                                    <span className="text-4xl">🤑</span>
                                </div>
                                <div>
                                    <div className="text-lg font-medium text-gray-800">
                                        Gaji Bulanan
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Gaji - 30 Mei 2025
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Caiir!!
                                    </div>
                                </div>
                            </div>
                            <div className="text-green-500 font-semibold text-3xl mr-3">
                                Rp. 5.500.000
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
