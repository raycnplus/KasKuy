// components/BackButton.jsx
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ fallback = "/dashboard", className = "inline-flex" }) {
  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate(fallback);
  };
  return (
    <button onClick={goBack} className={className} aria-label="Kembali">
      <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500 hover:text-emerald-600" />
    </button>
  );
}
