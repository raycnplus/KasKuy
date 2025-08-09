// EmojiPickerPopover.jsx
import "emoji-picker-element";
import React, { useEffect, useRef } from "react";

export default function EmojiPickerPopover({ open, onSelect, onClose }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!open || !hostRef.current) return;
    const picker = document.createElement("emoji-picker");
    picker.setAttribute("style", "max-height:360px;width:320px;");
    const handler = (e) => {
      onSelect(e.detail.unicode);
      onClose?.();
    };
    picker.addEventListener("emoji-click", handler);
    hostRef.current.appendChild(picker);
    return () => {
      picker.removeEventListener("emoji-click", handler);
      picker.remove();
    };
  }, [open, onSelect, onClose]);

  if (!open) return null;
  return (
    <div className="absolute z-50 mt-2">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div ref={hostRef} />
      </div>
    </div>
  );
}
