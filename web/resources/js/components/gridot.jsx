import React from 'react';

export default function GridLines() {
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Repeat dotted lines */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="absolute left-0 w-full border-t border-dotted border-white/30"
          style={{ top: `${(index + 1) * 16.66}%` }}
        />
      ))}
    </div>
  );
}
