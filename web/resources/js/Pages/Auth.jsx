import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import debounce from "lodash.debounce";
import api from "../api";

const AuthPages = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("login");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location.pathname === "/signup") {
      setCurrentPage("signup");
    } else if (location.pathname === "/forgot") {
      setCurrentPage("forgot");
    } else {
      setCurrentPage("login");
    }
  }, [location]);

  return null; // unused
};

const Split = ({ text, className, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimeout(() => setIsVisible(true), delay);
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={elementRef} className={className}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
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
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <Icon
          className={`w-5 h-5 transition-colors duration-300 ${
            error ? "text-red-500" : isFocused ? "text-pink-500" : "text-pink-400"
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
          error
            ? "border-red-400 shadow-lg shadow-red-200/50"
            : isFocused
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
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
};

const AnimatedButton = ({ children, onClick, disabled, loading, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`relative inline-flex items-center justify-center w-full px-6 py-4 rounded-xl shadow-lg bg-gradient-to-b from-pink-400 to-pink-600 text-white transition-all duration-300 ease-out group cursor-pointer hover:shadow-xl hover:shadow-pink-200/50 hover:from-pink-500 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    <div className="flex items-center gap-2">
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium text-base">Loading...</span>
        </>
      ) : (
        <>
          <span className="font-medium text-base">{children}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </>
      )}
    </div>
  </button>
);

// ————— LOGIN —————

const LoginPage = ({ onSwitchToSignup, onSwitchToForgot }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const validateForm = () => {
    const newErr = {};
    if (!formData.phone.trim()) newErr.phone = "Nomor telepon harus diisi";
    else if (!/^[0-9]{10,15}$/.test(formData.phone)) newErr.phone = "Nomor telepon tidak valid";
    if (!formData.password.trim()) newErr.password = "Password harus diisi";
    else if (formData.password.length < 6) newErr.password = "Password minimal 6 karakter";
    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await api.post("/login", {
        phone: formData.phone,
        password: formData.password,
      });
      const { token } = res.data;
      localStorage.setItem("token", token);
      toast.success("Berhasil masuk!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Toaster />
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-pink-100">
        <div className="text-center mb-8">
          <h1 className="text-pink-600 text-2xl font-semibold mb-2">Selamat Datang Kembali!</h1>
          <p className="text-pink-500/80">Masuk ke akun Kaskuy kamu</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300">
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatedInput
            icon={Phone}
            type="tel"
            placeholder="No. Telepon"
            value={formData.phone}
            onChange={handleInputChange("phone")}
            error={errors.phone}
          />

          <AnimatedInput
            icon={Lock}
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange("password")}
            showPassword={showPassword}
            togglePassword={() => setShowPassword((v) => !v)}
            error={errors.password}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 text-pink-500"
              />
              <span className="text-pink-600">Ingat saya</span>
            </label>
            <button
              type="button"
              onClick={onSwitchToForgot}
              className="text-pink-500 hover:text-pink-700 transition-colors"
            >
              Lupa password?
            </button>
          </div>

          <AnimatedButton loading={loading} disabled={loading}>
            Masuk
          </AnimatedButton>
        </form>

        <div className="text-center mt-6">
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
  );
};

// ————— SIGN UP (with OTP) —————

const SignUpPage = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [step, setStep] = useState("credentials"); // credentials | otp
  const [otp, setOtp] = useState("");

  const checkUsername = useCallback(
    debounce(async (value) => {
      if (value.length < 3) {
        setUsernameAvailable(null);
        setCheckingUsername(false);
        return;
      }
      try {
        const { data } = await api.get("/username-check", { params: { username: value } });
        setUsernameAvailable(data.available);
      } catch {
        setUsernameAvailable(false);
      } finally {
        setCheckingUsername(false);
      }
    }, 500),
    []
  );

  const handleInputChange = (field) => (e) => {
    const val = e.target.value;
    setFormData((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
    if (field === "username") {
      setCheckingUsername(true);
      setUsernameAvailable(null);
      checkUsername(val.trim().toLowerCase());
    }
  };

  const validateCredentials = () => {
    const newErr = {};
    if (!formData.username.trim()) newErr.username = "Username harus diisi";
    else if (formData.username.length < 3) newErr.username = "Username minimal 3 karakter";
    else if (usernameAvailable === false) newErr.username = "Username sudah dipakai";

    if (!formData.name.trim()) newErr.name = "Nama lengkap harus diisi";
    else if (formData.name.length < 2) newErr.name = "Nama lengkap minimal 2 karakter";

    if (!formData.phone.trim()) newErr.phone = "Nomor telepon harus diisi";
    else if (!/^[0-9]{10,15}$/.test(formData.phone)) newErr.phone = "Nomor telepon tidak valid";

    if (!formData.password.trim()) newErr.password = "Password harus diisi";
    else if (formData.password.length < 6) newErr.password = "Password minimal 6 karakter";

    if (!formData.confirmPassword.trim()) newErr.confirmPassword = "Konfirmasi password harus diisi";
    else if (formData.password !== formData.confirmPassword)
      newErr.confirmPassword = "Konfirmasi password tidak cocok";

    if (!agreeToTerms) newErr.terms = "Anda harus menyetujui syarat dan ketentuan";

    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!validateCredentials()) return;
    setLoading(true);
    try {
      await api.post("/register", {
        username: formData.username,
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });
      toast.success("OTP dikirim ke WhatsApp");
      setStep("otp");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrors({ otp: "OTP harus diisi" });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/register/verify", { phone: formData.phone, otp });
      const { token } = res.data;
      localStorage.setItem("token", token);
      toast.success("Akun terverifikasi—selamat datang!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP salah atau kedaluwarsa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Toaster />
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-pink-100">
        <div className="text-center mb-8">
          <h1 className="text-pink-600 text-2xl font-semibold mb-2">Selamat Datang!</h1>
          <p className="text-pink-500/80">Kelola keuangan dengan lebih mudah</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300">
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        <form
          onSubmit={step === "credentials" ? handleCredentialsSubmit : handleOtpSubmit}
          className="space-y-6"
        >
          {step === "credentials" ? (
            <>
              <AnimatedInput
                icon={User}
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange("username")}
                error={errors.username}
              />
              <div className="relative -mt-6 mb-4">
                {checkingUsername && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">...</span>
                )}
                {usernameAvailable && !checkingUsername && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                    ✓
                  </span>
                )}
                {usernameAvailable === false && !checkingUsername && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                    ✗
                  </span>
                )}
              </div>

              <AnimatedInput
                icon={User}
                type="text"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleInputChange("name")}
                error={errors.name}
              />

              <AnimatedInput
                icon={Phone}
                type="tel"
                placeholder="Nomor Telepon"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                error={errors.phone}
              />

              <AnimatedInput
                icon={Lock}
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange("password")}
                showPassword={showPassword}
                togglePassword={() => setShowPassword((v) => !v)}
                error={errors.password}
              />

              <AnimatedInput
                icon={Lock}
                type="password"
                placeholder="Konfirmasi Password"
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                showPassword={showConfirmPassword}
                togglePassword={() => setShowConfirmPassword((v) => !v)}
                error={errors.confirmPassword}
              />

              <div className="text-sm">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mr-2 mt-1 text-pink-500"
                  />
                  <span className="text-pink-600">
                    Saya setuju dengan{" "}
                    <a
                      href="#"
                      className="text-pink-500 hover:text-pink-700 transition-colors underline"
                    >
                      Syarat & Ketentuan
                    </a>{" "}
                    dan{" "}
                    <a
                      href="#"
                      className="text-pink-500 hover:text-pink-700 transition-colors underline"
                    >
                      Kebijakan Privasi
                    </a>
                  </span>
                </label>
                {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
              </div>

              <AnimatedButton loading={loading} disabled={loading}>
                Daftar Sekarang
              </AnimatedButton>
            </>
          ) : (
            <>
              <AnimatedInput
                icon={Mail}
                type="text"
                placeholder="Masukkan OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={errors.otp}
              />
              <AnimatedButton loading={loading} disabled={loading}>
                Verifikasi OTP
              </AnimatedButton>
            </>
          )}
        </form>

        <div className="text-center mt-6">
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
  );
};

// ————— FORGOT PASSWORD —————

const ForgotPasswordPage = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("request"); // request | verify
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrors({ phone: "Nomor telepon harus diisi" });
      return;
    }
    setLoading(true);
    try {
      await api.post("/forgot-pw/request", { phone });
      toast.success("OTP lupa password dikirim");
      setStep("verify");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal kirim OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const newErr = {};
    if (!otp.trim()) newErr.otp = "OTP harus diisi";
    if (!newPassword) newErr.newPassword = "Password baru harus diisi";
    if (newPassword.length < 6) newErr.newPassword = "Password minimal 6 karakter";
    if (newPassword !== confirmPassword) newErr.confirmPassword = "Konfirmasi tidak cocok";
    if (Object.keys(newErr).length) {
      setErrors(newErr);
      return;
    }
    setLoading(true);
    try {
      await api.post("/forgot-pw/verify", {
        phone,
        otp,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      toast.success("Password berhasil direset");
      onSwitchToLogin();
    } catch (err) {
      toast.error(err.response?.data?.message || "Verifikasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Toaster />
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-pink-100">
        <div className="text-center mb-8">
          <h1 className="text-pink-600 text-2xl font-semibold mb-2">Lupa Password</h1>
          <p className="text-pink-500/80">Reset password melalui OTP WhatsApp</p>
        </div>

        <form onSubmit={step === "request" ? handleRequest : handleVerify} className="space-y-6">
          {step === "request" ? (
            <AnimatedInput
              icon={Phone}
              type="tel"
              placeholder="No. Telepon"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({});
              }}
              error={errors.phone}
            />
          ) : (
            <>
              <AnimatedInput
                icon={Mail}
                type="text"
                placeholder="Masukkan OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (errors.otp) setErrors((p) => ({ ...p, otp: null }));
                }}
                error={errors.otp}
              />
              <AnimatedInput
                icon={Lock}
                type="password"
                placeholder="Password Baru"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) setErrors((p) => ({ ...p, newPassword: null }));
                }}
                showPassword={false}
                togglePassword={() => {}}
                error={errors.newPassword}
              />
              <AnimatedInput
                icon={Lock}
                type="password"
                placeholder="Konfirmasi Password Baru"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: null }));
                }}
                showPassword={false}
                togglePassword={() => {}}
                error={errors.confirmPassword}
              />
            </>
          )}

          <AnimatedButton loading={loading} disabled={loading}>
            {step === "request" ? "Kirim OTP" : "Reset Password"}
          </AnimatedButton>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
          >
            Kembali ke Masuk
          </button>
        </div>
      </div>
    </div>
  );
};

const Auth = () => {
  const [currentPage, setCurrentPage] = useState("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 text-pink-500/80 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-pink-200/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-3xl font-bold text-pink-600">Kaskuy</span>
          <a href="/" className="text-pink-600 hover:text-pink-700 transition-colors font-medium">
            Kembali ke Beranda
          </a>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-lg">
          {currentPage === "login" && (
            <LoginPage
              onSwitchToSignup={() => setCurrentPage("signup")}
              onSwitchToForgot={() => setCurrentPage("forgot")}
            />
          )}
          {currentPage === "signup" && (
            <SignUpPage onSwitchToLogin={() => setCurrentPage("login")} />
          )}
          {currentPage === "forgot" && (
            <ForgotPasswordPage onSwitchToLogin={() => setCurrentPage("login")} />
          )}
        </div>
      </div>

      {/* Floating elements */}
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
