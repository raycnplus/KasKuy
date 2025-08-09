import { useState } from "react";

export default function AnimatedToggleButton() {
  const [isLeft, setIsLeft] = useState(true);

  const togglePosition = () => {
    setIsLeft(!isLeft);
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-20 bg-pink-500/20 backdrop-blur-xl border-2 border-gray-200 rounded-2xl p-2 overflow-hidden">
        <div
          className={`absolute top-2 bottom-2 left-2 w-1/2 bg-gradient-to-r from-pink-400 to-pink-500 rounded-xl shadow-lg transition-transform duration-300 ease-in-out ${
            isLeft ? "translate-x-0" : "translate-x-[calc(100%-1rem)]"
          }`}
        />
        <div className="relative grid grid-cols-2 h-full">
          <button
            onClick={togglePosition}
            className={`transition-all duration-300 ease-in-out transform active:scale-95 ${
              isLeft ? "z-20" : "z-10"
            }`}
          >
            <h3
              className={`text-xl sm:text-2xl font-medium flex justify-center items-center h-full transition-colors duration-300 ${
                isLeft ? "text-white drop-shadow-md" : "text-pink-500"
              }`}
            >
              Catat pemasukkan
            </h3>
          </button>

          <button
            onClick={togglePosition}
            className={`transition-all duration-300 ease-in-out transform active:scale-95 ${
              !isLeft ? "z-20" : "z-10"
            }`}
          >
            <h3
              className={`text-xl sm:text-2xl font-medium flex justify-center items-center h-full transition-colors duration-300 ${
                !isLeft ? "text-white drop-shadow-md" : "text-pink-500"
              }`}
            >
              Catat pengeluaran
            </h3>
          </button>
        </div>

      </div>
    </div>
  );
}
