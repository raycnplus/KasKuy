import React, { useState, useEffect, useRef } from 'react';

const Tablet = ({ src, alt = "Preview" }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const tabletRef = useRef(null);

   useEffect(() => {
    const handleMouseMove = (e) => {
      if (tabletRef.current) {
        const rect = tabletRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        setMousePosition({ x: deltaX, y: deltaY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const maxRotation = 15;
  const rotateX = -(mousePosition.y / window.innerHeight) * maxRotation;
  const rotateY = (mousePosition.x / window.innerWidth) * maxRotation;

  return (
    <div
      ref={tabletRef}
      className="transform transition-transform duration-100 ease-out"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }}
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
