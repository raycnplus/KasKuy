import React from "react";
import { NotebookPen, Notebook, BarChart3, PieChart } from "lucide-react";

const Dashboard = () => {
    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-pink-400 to-pink-600 text-pink-500/80 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-pink-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
            </div>

            <div className="p-7">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-xl rounded-full px-4 py-2">
                        <div className="w-10 h-10 rounded-full bg-gray-400" />
                        <p className="font-semibold text-lg text-gray-800">Fardhan</p>
                    </div>
                    <div className="text-white font-medium">
                        Bulan Juli 2025 ▼
                    </div>
                </div>

                {/* Balance Section */}
                <div className="mb-8">
                    <h2 className="text-white text-xl font-medium mb-2">Sisa Uang</h2>
                    <h1 className="text-white font-bold text-6xl mb-6">Rp. 500.230</h1>

                    {/* Income/Expense Cards */}
                    <div className="flex gap-4 mb-8">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                                <span className="text-gray-700 font-medium">Pemasukan</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">Rp.5.500.000</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                                <span className="text-gray-700 font-medium">Pengeluaran</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">Rp.5.500.000</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Panel */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl rounded-t-3xl p-6">
                <div className="flex gap-6">
                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button className="flex flex-col items-center">
                            <div className="bg-pink-500 hover:bg-pink-600 active:scale-95 transition ease-in-out duration-300 h-16 w-16 rounded-2xl flex justify-center items-center mb-2">
                                <NotebookPen className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Catat</span>
                        </button>
                        <button className="flex flex-col items-center">
                            <div className="bg-pink-500 hover:bg-pink-600 active:scale-95 transition ease-in-out duration-300 h-16 w-16 rounded-2xl flex justify-center items-center mb-2">
                                <Notebook className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Daftar Kas</span>
                        </button>
                        <button className="flex flex-col items-center">
                            <div className="bg-pink-500 hover:bg-pink-600 active:scale-95 transition ease-in-out duration-300 h-16 w-16 rounded-2xl flex justify-center items-center mb-2">
                                <BarChart3 className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Analitik</span>
                        </button>
                        <button className="flex flex-col items-center">
                            <div className="bg-pink-500 hover:bg-pink-600 active:scale-95 transition ease-in-out duration-300 h-16 w-16 rounded-2xl flex justify-center items-center mb-2">
                                <PieChart className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Chart</span>
                        </button>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px bg-gray-300 mx-4"></div>

                    {/* Transaction List */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                                    <span className="text-lg">😴</span>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white">↗</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800 text-sm">Perpisahan muncak bareng temen</div>
                                    <div className="text-xs text-gray-500">Hedon - 30 Mei 2025</div>
                                    <div className="text-xs text-gray-400">sewa villa dan barbeque-an sama anak kelas</div>
                                </div>
                            </div>
                            <div className="text-red-500 font-bold text-sm">Rp. 900.000</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center relative">
                                    <span className="text-lg">🍽️</span>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white">↗</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800 text-sm">Fine Dining di The Garden Osteria</div>
                                    <div className="text-xs text-gray-500">Makan - 30 Mei 2025</div>
                                    <div className="text-xs text-gray-400">Self Rewards</div>
                                </div>
                            </div>
                            <div className="text-red-500 font-bold text-sm">Rp. 3.500.000</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center relative">
                                    <span className="text-lg">🤑</span>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white">↘</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800 text-sm">Gaji Bulanan</div>
                                    <div className="text-xs text-gray-500">Gaji - 30 Mei 2025</div>
                                    <div className="text-xs text-gray-400">Caiir!!</div>
                                </div>
                            </div>
                            <div className="text-green-500 font-bold text-sm">Rp. 5.500.000</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
