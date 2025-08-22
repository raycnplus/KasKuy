import { useRef, useEffect } from "react";
import gsap from "gsap";

const steps = [
  { title: "Kelola Uang Harian", desc: "...", images: [logo1, logo2, logo3] },
  { ... }
];

const StepsCarousel = () => {
  const stepsRef = useRef();
  const slidesWrapRef = useRef();
  const dotsRef = useRef();
  const currentIndexRef = useRef(0);

  useEffect(() => {
    gsap.set(slides[0], { autoAlpha: 1 });
    gsap.set(dots[0], { opacity: 1 });

    const stepsST = ScrollTrigger.create({
      trigger: stepsRef.current,
      start: "top top",
      end: "+=" + steps.length * window.innerHeight,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        if (idx !== currentIndexRef.current) {
          switchSlide(currentIndexRef.current, idx);
          currentIndexRef.current = idx;
        }
      }
    });

    return () => stepsST.kill();
  }, []);

  const switchSlide = (from, to) => {
    if (from !== -1) gsap.to(slides[from], { autoAlpha: 0, duration: 0.5, scale: 0.97 });
    gsap.to(slides[to], { autoAlpha: 1, duration: 0.6, scale: 1 });
    dots.forEach((d, i) => gsap.to(d, { width: i === to ? 48 : 20, opacity: i === to ? 1 : 0.6, duration: 0.2 }));
  };

  return (
    <section ref={stepsRef} className="relative h-[100svh] w-screen bg-[#0E6F5F] text-[#e3e3db] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={slidesWrapRef} className="relative w-full h-full">
          {steps.map((s, i) => (
            <div key={i} className={`absolute inset-0 flex`}>
              {/* Slide content: title, desc, images */}
            </div>
          ))}
        </div>
      </div>
      <div ref={dotsRef} className="absolute bottom-6 right-6 flex items-center gap-2">
        {steps.map((_, i) => (
          <button key={i} className="h-3 rounded-full transition-all" />
        ))}
      </div>
    </section>
  );
};

export default StepsCarousel;
