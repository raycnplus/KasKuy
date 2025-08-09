import React, { useState } from "react";

const CenteredRupiahInput = () => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setValue(raw);
  };

  return (
    <div className="relative w-full">
      {/* Fake input for visual center alignment */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-3xl font-semibold text-pink-400">
          Rp. {value || "0000"}
        </span>
      </div>

      {/* Real input: invisible text but captures typing */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="bg-white w-full h-[70px] rounded-t-3xl rounded-b-xl text-3xl font-semibold text-transparent caret-pink-500 placeholder-transparent text-center p-5 focus:outline-none"
        placeholder="0000"
      />
    </div>
  );
};

export default CenteredRupiahInput;
