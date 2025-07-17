import React, { useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import Split from "../split";
import Magnet from "../magnet";

const LPJoin = () => {
    const [hovered, setHovered] = useState(false);
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start">
            <Magnet padding={60} magnetStrength={10}>
                <button
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-md bg-gradient-to-b from-pink-400 to-pink-600 text-white transition-all duration-300 ease-out group cursor-pointer w-full sm:w-auto"
                >
                    <div className="flex items-center gap-2">
                        <div className="relative h-[24px] sm:h-[28px] leading-[24px] sm:leading-[28px] overflow-hidden w-[160px] sm:w-[200px]">
                            <span
                                className={`absolute inset-0 flex items-center justify-start text-sm sm:text-base font-medium transition-all duration-400 ease-in-out ${
                                    hovered
                                        ? "opacity-0 translate-y-2"
                                        : "opacity-100 translate-y-0"
                                }`}
                            >
                                Cobain Sekarang
                            </span>
                            <div
                                className={`absolute inset-0 flex items-center transition-all duration-400 ease-in-out ${
                                    hovered
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 -translate-y-2 pointer-events-none"
                                }`}
                            >
                                <Split
                                    key={hovered ? "split" : "default"}
                                    text="Martabak manis🥵🥵"
                                    className="text-sm sm:text-base font-medium text-white w-full"
                                    delay={10}
                                    duration={0.5}
                                    ease="power3.out"
                                    splitType="chars"
                                    from={{ opacity: 0, y: 40 }}
                                    to={{ opacity: 1, y: 0 }}
                                    threshold={0.1}
                                    rootMargin="-100px"
                                    textAlign="left"
                                />
                            </div>
                        </div>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                </button>
            </Magnet>

            <button className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-md border-2 border-pink-500 bg-transparent text-pink-600 transition-all duration-300 ease-out group cursor-pointer hover:bg-pink-50 hover:text-pink-700 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                    <div className="relative h-[24px] sm:h-[28px] leading-[24px] sm:leading-[28px] overflow-hidden w-[80px] sm:w-[100px]">
                        <span className="absolute inset-0 flex items-center justify-start text-sm sm:text-base font-medium transition-all duration-400 ease-in-out">
                            Pelajari Fitur
                        </span>
                    </div>
                    <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-y-1 transition-transform duration-300 text-pink-600 group-hover:text-pink-700" />
                </div>
            </button>
        </div>
    );
};

export default LPJoin;
