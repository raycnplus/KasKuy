import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";

const AuthPages = () => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState("login");

    useEffect(() => {
        if (location.pathname === "/signup") {
            setCurrentPage("SignUpPage");
        } else {
            setCurrentPage("LoginPage");
        }
    }, [location]);
}
const Split = ({ text, className, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                }
            },
            { threshold: 0.1 }
        );
        if (elementRef.current) {
            observer.observe(elementRef.current);
        }
        return () => observer.disconnect();
    }, [delay]);
    return (
        <div ref={elementRef} className={className}>
            {text.split("").map((char, index) => (
                <span
                    key={index}
                    className={`inline-block transition-all duration-700 ease-out ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${index * 30}ms` }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </div>
    );
};

const AnimatedInput = ({
    icon: Icon,
    type,
    placeholder,
    value,
    onChange,
    showPassword,
    togglePassword,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Icon
                    className={`w-5 h-5 transition-colors duration-300 ${
                        isFocused ? "text-pink-500" : "text-pink-400"
                    }`}
                />
            </div>
            <input
                type={type === "password" && showPassword ? "text" : type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-pink-400 text-pink-700 focus:outline-none ${
                    isFocused
                        ? "border-pink-400 shadow-lg shadow-pink-200/50 bg-white/80"
                        : "border-pink-200 hover:border-pink-300"
                }`}
            />
            {type === "password" && (
                <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors duration-200"
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            )}
        </div>
    );
};

const AnimatedButton = ({ children, onClick, disabled, className = "" }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative inline-flex items-center justify-center w-full px-6 py-4 rounded-xl shadow-lg bg-gradient-to-b from-pink-400 to-pink-600 text-white transition-all duration-300 ease-out group cursor-pointer hover:shadow-xl hover:shadow-pink-200/50 hover:from-pink-500 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            <div className="flex items-center gap-2">
                <span className="font-medium text-base">{children}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
        </button>
    );
};

const LoginPage = ({ onSwitchToSignup }) => {
    const [formData, setFormData] = useState({
        telfon: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const handleInputChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login:", formData);
    };
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-pink-100">
                <div className="text-center mb-8">
                    <h1 className="text-pink-600 text-2xl font-semibold mb-2">Selamat Datang Kembali!</h1>
                    <p className="text-pink-500/80">Masuk ke akun Kaskuy kamu</p>
                </div>
                <div className="space-y-6">
                    <AnimatedInput
                        icon={Phone}
                        type="telfon"
                        placeholder="No. Telfon"
                        value={formData.telfon}
                        onChange={handleInputChange("telfon")}
                    />
                    <AnimatedInput
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange("password")}
                        showPassword={showPassword}
                        togglePassword={() => setShowPassword(!showPassword)}
                    />
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="mr-2 text-pink-500"
                            />
                            <span className="text-pink-600">Ingat saya</span>
                        </label>
                        <a href="#" className="text-pink-500 hover:text-pink-700 transition-colors">
                            Lupa password?
                        </a>
                    </div>
                    <AnimatedButton onClick={handleSubmit}>Masuk</AnimatedButton>
                    <div className="text-center">
                        <p className="text-pink-500/80">
                            Belum punya akun?{" "}
                            <button
                                type="button"
                                onClick={onSwitchToSignup}
                                className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
                            >
                                Daftar sekarang
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SignUpPage = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        telfon: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleInputChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sign up:", formData);
    };
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-pink-100">
                <div className="text-center mb-8">
                    <h1 className="text-pink-600 text-2xl font-semibold mb-2">Selamat Datang!</h1>
                    <p className="text-pink-500/80">Kelola keuangan dengan lebih mudah</p>
                </div>
                <div className="space-y-6">
                    <AnimatedInput
                        icon={User}
                        type="text"
                        placeholder="Nama Lengkap"
                        value={formData.fullName}
                        onChange={handleInputChange("fullName")}
                    />
                    <AnimatedInput
                        icon={Phone}
                        type="telfon"
                        placeholder="Nomor Telepon"
                        value={formData.phone}
                        onChange={handleInputChange("phone")}
                    />
                    <AnimatedInput
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange("password")}
                        showPassword={showPassword}
                        togglePassword={() => setShowPassword(!showPassword)}
                    />
                    <AnimatedInput
                        icon={Lock}
                        type="password"
                        placeholder="Konfirmasi Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange("confirmPassword")}
                        showPassword={showConfirmPassword}
                        togglePassword={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    />
                    <div className="text-sm">
                        <label className="flex items-start cursor-pointer">
                            <input
                                type="checkbox"
                                className="mr-2 mt-1 text-pink-500"
                            />
                            <span className="text-pink-600">
                                Saya setuju dengan{" "}
                                <a
                                    href="#"
                                    className="text-pink-500 hover:text-pink-700 transition-colors"
                                >
                                    Syarat & Ketentuan
                                </a>{" "}
                                dan{" "}
                                <a
                                    href="#"
                                    className="text-pink-500 hover:text-pink-700 transition-colors"
                                >
                                    Kebijakan Privasi
                                </a>
                            </span>
                        </label>
                    </div>
                    <AnimatedButton onClick={handleSubmit}>Daftar Sekarang</AnimatedButton>
                    <div className="text-center">
                        <p className="text-pink-500/80">
                            Sudah punya akun?{" "}
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
                            >
                                Masuk di sini
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Auth = () => {
    const [currentPage, setCurrentPage] = useState("login");

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 text-pink-500/80 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-pink-200/15 rounded-full blur-3xl animate-pulse"></div>
            </div>
            <nav className="relative z-10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-3xl font-bold text-pink-600">Kaskuy</span>
                    </div>
                    <a
                        href="/"
                        className="text-pink-600 hover:text-pink-700 transition-colors font-medium"
                    >
                        Kembali ke Beranda
                    </a>
                </div>
            </nav>
            <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
                <div className="w-full max-w-lg">
                    {currentPage === "login" ? (
                        <LoginPage
                            onSwitchToSignup={() => setCurrentPage("signup")}
                        />
                    ) : (
                        <SignUpPage
                            onSwitchToLogin={() => setCurrentPage("login")}
                        />
                    )}
                </div>
            </div>
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-300 rounded-full animate-bounce"></div>
            <div
                className="absolute top-3/4 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.5s" }}
            ></div>
            <div
                className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-500 rounded-full animate-bounce"
                style={{ animationDelay: "1s" }}
            ></div>
        </div>
    );
};

export default Auth;
