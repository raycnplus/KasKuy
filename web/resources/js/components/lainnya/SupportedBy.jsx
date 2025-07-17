import React from 'react'
import smk from "../../../../public/img/logo/smk.png";
import drtj from "../../../../public/img/logo/drtj.png";
import bangkit from "../../../../public/img/logo/bangkit.png";

const SupportedBy = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl mt-12 sm:mt-16 lg:mt-20 font-semibold text-pink-600">
        Didukung oleh
      </h1>

      <div className="hidden sm:flex mt-6 sm:mt-7 justify-center items-center flex-wrap gap-4 sm:gap-8 lg:gap-12 xl:gap-40">
        <img
          src={smk}
          className="w-[120px] sm:w-[160px] lg:w-[220px] h-auto object-contain"
          alt="SMK"
        />
        <img
          src={drtj}
          className="w-[110px] sm:w-[140px] lg:w-[200px] h-auto object-contain"
          alt="Dr. TJ"
        />
        <img
          src={bangkit}
          className="w-[130px] sm:w-[170px] lg:w-[240px] h-auto object-contain"
          alt="Bangkit"
        />
      </div>

      {/* Mobile View - Stacked */}
      <div className="sm:hidden mt-6 flex flex-col items-center space-y-6">
        <img
          src={smk}
          className="w-[180px] h-auto object-contain"
          alt="SMK"
        />
        <img
          src={drtj}
          className="w-[160px] h-auto object-contain"
          alt="Dr. TJ"
        />
        <img
          src={bangkit}
          className="w-[200px] h-auto object-contain"
          alt="Bangkit"
        />
      </div>
    </div>
  )
}

export default SupportedBy
