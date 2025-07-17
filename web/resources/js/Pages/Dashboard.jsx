import React from "react";
import { NotebookPen, Notebook, ChartNoAxesColumn } from "lucide-react";
const Dashboard = () => {
    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-pink-400 to-pink-600 text-pink-500/80 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-pink-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
            </div>
            <div className="w-screen h-[450px] absolute bottom-0 bg-white/70 border-2 border-white backdrop-blur-xl rounded-t-3xl p-10 flex justify-end">
                <div className="w-1/3 h-full absolute left-0 bottom-0 top-0 p-10">
                    <div className="grid grid-cols-2 gap-2 justify-items-center items-center h-full">
                        {[...Array(4)].map((_, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <div className="bg-white/90 backdrop-blur-xl h-[120px] w-[120px] rounded-3xl p-5 flex justify-center items-center mb-1">
                                    <NotebookPen className="w-[70px] h-[70px]" />
                                </div>
                                <h1 className="text-center w-[100px] text-lg font-medium">Catat</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
