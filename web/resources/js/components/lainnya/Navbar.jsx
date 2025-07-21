import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

  const handleLogoClick = () => window.location.reload();

  const handleScrollToSection = (id) => {
    const section = document.getElementById(id);
    const navbarOffset = 120;
    if (section) {
      const y =
        section.getBoundingClientRect().top + window.pageYOffset - navbarOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

    return (
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-pink-200/50 sticky top-4 z-50 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center space-x-3">
                <span className="text-2xl sm:text-3xl font-bold text-pink-600 tracking-tight" onClick={handleLogoClick}>
                    Kaskuy
                </span>
            </div>

            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-pink-600 font-medium">
                <a
                    href="#features"
                    className="hover:text-pink-700 transition-colors duration-200 hover:underline decoration-pink-400 underline-offset-4"
                >
                    Fitur
                </a>
                <a
                    href="#how-it-works"
                    className="hover:text-pink-700 transition-colors duration-200 hover:underline decoration-pink-400 underline-offset-4"
                >
                    Cara Kerja
                </a>
                <div className="space-x-4">
                    <Link
                        to="/login"
                        className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-md border-2 border-pink-500 bg-transparent text-pink-600 transition-all duration-300 ease-out group cursor-pointer hover:bg-pink-50 hover:text-pink-700 w-full sm:w-auto"
                    >
                        <div className="flex items-center gap-2">
                            <div className="relative h-[24px] sm:h-[28px] leading-[24px] sm:leading-[28px] overflow-hidden w-[80px] sm:w-[50px]">
                                <span className="absolute inset-0 flex items-center justify-center text-sm sm:text-base font-medium transition-all duration-400 ease-in-out">
                                    Masuk
                                </span>
                            </div>
                        </div>
                    </Link>
                    <Link
                        to="/signup"
                        className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-md bg-gradient-to-b from-pink-400 to-pink-600 text-white transition-all duration-300 ease-out group cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <div className="relative h-[24px] sm:h-[28px] w-[100px] leading-[24px] sm:leading-[28px] overflow-hidden w-[80px] sm:w-[70px]">
                                <span className="absolute inset-0 flex items-center justify-center text-sm sm:text-base font-medium transition-all duration-400 ease-in-out">
                                    Daftar
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </nav>

            <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-pink-600 hover:bg-pink-100 rounded-lg transition-colors duration-200"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                            isMenuOpen
                                ? "M6 18L18 6M6 6l12 12"
                                : "M4 6h16M4 12h16M4 18h16"
                        }
                    />
                </svg>
            </button>

            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 md:hidden bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-pink-200/50 overflow-hidden">
                    <nav className="flex flex-col py-4">
                        <Link
                            to="#features"
                            onClick={toggleMenu}
                            className="px-6 py-3 text-pink-600 font-medium hover:bg-pink-50 transition-colors duration-200"
                        >
                            Fitur
                        </Link>
                        <Link
                            to="#how-it-works"
                            onClick={toggleMenu}
                            className="px-6 py-3 text-pink-600 font-medium hover:bg-pink-50 transition-colors duration-200"
                        >
                            Cara Kerja
                        </Link>
                        {/* <Link
                            to="/login"
                            onClick={toggleMenu}
                            className="px-6 py-3 text-pink-600 font-medium hover:bg-pink-50 transition-colors duration-200"
                        >
                            Masuk
                        </Link> */}
                        <Link
                            to="/signup"
                            onClick={toggleMenu}
                            className="px-6 py-3 text-pink-600 font-medium hover:bg-pink-50 transition-colors duration-200"
                        >
                            Masuk
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
