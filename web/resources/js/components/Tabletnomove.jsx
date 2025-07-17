import React, { useState, useEffect, useRef } from 'react';

const Tablet = ({ src, alt = "Preview" }) => {
  return (
    <div
      className="transform transition-transform duration-100 ease-out"
    >
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-2 shadow-2xl">
        <div className="rounded-xl overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Tablet;
