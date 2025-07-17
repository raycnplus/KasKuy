import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Phone, RotateCcw, CheckCircle } from "lucide-react";

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

const OTPInput = ({ length = 6, onComplete, value, onChange }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (value) {
            const otpArray = value.split("").slice(0, length);
            const newOtp = [...otpArray, ...new Array(length - otpArray.length).fill("")];
            setOtp(newOtp);
        }
    }, [value, length]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value && index < length - 1) {
            setActiveIndex(index + 1);
            inputRefs.current[index + 1].focus();
        }

        const otpString = newOtp.join("");
        onChange(otpString);

        if (otpString.length === length) {
            onComplete(otpString);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                setActiveIndex(index - 1);
                inputRefs.current[index - 1].focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            setActiveIndex(index - 1);
            inputRefs.current[index - 1].focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            setActiveIndex(index + 1);
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain");
        const pastedArray = pastedData.slice(0, length).split("");

        if (pastedArray.every(char => !isNaN(char))) {
            const newOtp = [...pastedArray, ...new Array(length - pastedArray.length).fill("")];
            setOtp(newOtp);
            onChange(pastedArray.join(""));

            if (pastedArray.length === length) {
                onComplete(pastedArray.join(""));
            }
        }
    };

    return (
        <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={() => setActiveIndex(index)}
                    onPaste={handlePaste}
                    className={`w-12 h-12 text-center text-lg font-semibold rounded-xl border-2 transition-all duration-300 bg-white/70 backdrop-blur-sm text-pink-700 focus:outline-none ${
                        activeIndex === index
                            ? "border-pink-400 shadow-lg shadow-pink-200/50 bg-white/80"
                            : "border-pink-200 hover:border-pink-300"
                    }`}
                />
            ))}
        </div>
    );
};

const PhoneInput = ({ value, onChange, onFocus, onBlur, isFocused }) => {
    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Phone
                    className={`w-5 h-5 transition-colors duration-300 ${
                        isFocused ? "text-pink-500" : "text-pink-400"
                    }`}
                />
            </div>

            <input
                type="tel"
                placeholder="Nomor Telepon"
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-pink-400 text-pink-700 focus:outline-none ${
                    isFocused
                        ? "border-pink-400 shadow-lg shadow-pink-200/50 bg-white/80"
                        : "border-pink-200 hover:border-pink-300"
                }`}
            />
        </div>
    );
};

const LoginPage = ({ onSendOTP, phoneNumber, setPhoneNumber }) => {
    const [isPhoneFocused, setIsPhoneFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async () => {
        if (phoneNumber.length < 10) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onSendOTP();
        }, 1500);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-pink-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8 text-pink-600" />
                    </div>
                    <h1 className="text-pink-600 text-2xl font-semibold mb-2">Verifikasi Nomor Telepon</h1>
                    <p className="text-pink-500/80">
                        Masukkan nomor telepon untuk menerima kode OTP
                    </p>
                    <div className="bg-pink-50 rounded-lg p-3 mt-4">
                        <p className="text-pink-600 text-sm font-medium">Demo Account:</p>
                        <p className="text-pink-700 text-sm">Phone: 08123456789</p>
                        <p className="text-pink-700 text-sm">OTP: 123456</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <PhoneInput
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        onFocus={() => setIsPhoneFocused(true)}
                        onBlur={() => setIsPhoneFocused(false)}
                        isFocused={isPhoneFocused}
                    />

                    <AnimatedButton
                        onClick={handleSendOTP}
                        disabled={phoneNumber.length < 10 || isLoading}
                    >
                        {isLoading ? "Mengirim..." : "Kirim Kode OTP"}
                    </AnimatedButton>
                </div>
            </div>
        </div>
    );
};

const OTPVerificationPage = ({ onVerify, phoneNumber, onResend, onBack }) => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleVerify = async () => {
        if (otp.length !== 6) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onVerify(otp);
        }, 1500);
    };

    const handleResend = () => {
        setCountdown(60);
        setCanResend(false);
        setOtp("");
        onResend();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-pink-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-pink-600" />
                    </div>
                    <h1 className="text-pink-600 text-2xl font-semibold mb-2">Verifikasi Login</h1>
                    <p className="text-pink-500/80 mb-2">
                        Untuk keamanan akun Anda, masukkan kode OTP yang telah dikirim ke
                    </p>
                    <p className="text-pink-600 font-medium">
                        {phoneNumber}
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-pink-600 font-medium mb-4 text-center">
                            Masukkan 6 digit kode OTP
                        </label>
                        <OTPInput
                            length={6}
                            value={otp}
                            onChange={setOtp}
                            onComplete={setOtp}
                        />
                    </div>

                    <AnimatedButton
                        onClick={handleVerify}
                        disabled={otp.length !== 6 || isLoading}
                    >
                        {isLoading ? "Memverifikasi..." : "Verifikasi"}
                    </AnimatedButton>

                    <div className="text-center space-y-2">
                        <p className="text-pink-500/80 text-sm">
                            Tidak menerima kode?
                        </p>

                        {canResend ? (
                            <button
                                onClick={handleResend}
                                className="text-pink-600 hover:text-pink-700 font-medium transition-colors flex items-center gap-2 mx-auto"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Kirim Ulang
                            </button>
                        ) : (
                            <p className="text-pink-500/60 text-sm">
                                Kirim ulang dalam {formatTime(countdown)}
                            </p>
                        )}
                    </div>

                    {onBack && (
                        <div className="text-center">
                            <button
                                onClick={onBack}
                                className="text-pink-500 hover:text-pink-700 font-medium transition-colors"
                            >
                                Ganti nomor telepon
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SuccessPage = ({ onContinue }) => {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-pink-100">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-pink-600 text-2xl font-semibold mb-2">Login Berhasil!</h1>
                    <p className="text-pink-500/80">
                        Selamat datang kembali di Kaskuy
                    </p>
                </div>

                <div className="space-y-6">
                    <AnimatedButton onClick={onContinue}>
                        Masuk ke Dashboard
                    </AnimatedButton>
                </div>
            </div>
        </div>
    );
};

const LoginOTPFlow = () => {
    const [currentStep, setCurrentStep] = useState("login");
    const [phoneNumber, setPhoneNumber] = useState("");

    const dummyAccount = {
        phone: "08123456789",
        otp: "123456",
        name: "John Doe",
        password: "password123",
    };

    const handleSendOTP = () => {
        if (phoneNumber === dummyAccount.phone) {
            setCurrentStep("otp");
        } else {
            alert("Nomor telepon tidak terdaftar. Gunakan: " + dummyAccount.phone);
        }
    };

    const handleVerifyOTP = (otp) => {
        if (otp === dummyAccount.otp) {
            console.log("OTP verified:", otp);
            setCurrentStep("success");
        } else {
            alert("Kode OTP salah. Gunakan: " + dummyAccount.otp);
        }
    };

    const handleResendOTP = () => {
        console.log("Resending OTP to:", phoneNumber);
        alert("OTP telah dikirim ulang. Gunakan: " + dummyAccount.otp);
    };

    const handleBackToLogin = () => {
        setCurrentStep("login");
    };

    const handleContinue = () => {
        console.log("Login successful with verified phone:", phoneNumber);
        alert("Selamat datang, " + dummyAccount.name + "!");
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case "login":
                return (
                    <LoginPage
                        onSendOTP={handleSendOTP}
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                    />
                );
            case "otp":
                return (
                    <OTPVerificationPage
                        onVerify={handleVerifyOTP}
                        phoneNumber={phoneNumber}
                        onResend={handleResendOTP}
                        onBack={handleBackToLogin}
                    />
                );
            case "success":
                return <SuccessPage onContinue={handleContinue} />;
            default:
                return null;
        }
    };

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
                        <span className="text-3xl font-bold text-pink-600">
                            Kaskuy
                        </span>
                    </div>

                    <a
                        href="#"
                        className="text-pink-600 hover:text-pink-700 transition-colors font-medium"
                    >
                        Kembali ke Beranda
                    </a>
                </div>
            </nav>

            <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
                <div className="w-full max-w-lg">
                    {renderCurrentStep()}
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

export default LoginOTPFlow;
