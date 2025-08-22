import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
    Eye,
    EyeOff,
    Calendar,
    ChevronDown,
    ArrowDownRight,
    ArrowUpRight,
    RefreshCw,
} from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import logo1 from "./tes/src/logo1.png";
import logo2 from "./tes/src/logo2.png";
import logo3 from "./tes/src/logo3.png";
import logo4 from "./tes/src/logo4.png";
import logo5 from "./tes/src/logo5.png";

const ICONS = [logo1, logo2, logo3, logo4, logo5];
const MINT_BG =
    "radial-gradient(1200px 800px at 50% 40%, #f7fffb 0%, #eafff5 40%, #dff7f1 65%, #cfeee6 100%)";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
    const heroRef = useRef(null);
    const headerRef = useRef(null);
    const iconsWrapRef = useRef(null);
    const duplicatesRef = useRef([]);
    const tickerFnRef = useRef(null);
    const subheadlineRef = useRef(null);
    const pillsRef = useRef(null);
    const underlineRef = useRef(null);

    const stepsRef = useRef(null);
    const slidesWrapRef = useRef(null);
    const dotsRef = useRef(null);
    const currentStepRef = useRef(-1);
    const lenisRef = useRef(null);

    useEffect(() => {
        if (!heroRef.current || !iconsWrapRef.current) return;
        const hero = heroRef.current;
        const heroHeader = headerRef.current;
        const animatedIcons = iconsWrapRef.current;

        const iconElements = animatedIcons.querySelectorAll(".animated-icon");
        const textSegments = hero.querySelectorAll(".text-segment");
        const placeholders = hero.querySelectorAll(".placeholder-icon");
        const extras = { sub: null, pills: null, underline: null };

        const lenis = new Lenis();
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time) => lenis.raf(time * 1000);
        tickerFnRef.current = tick;
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        const textAnimationOrder = [];
        textSegments.forEach((segment, index) =>
            textAnimationOrder.push({ segment, originalIndex: index })
        );
        for (let i = textAnimationOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [textAnimationOrder[i], textAnimationOrder[j]] = [
                textAnimationOrder[j],
                textAnimationOrder[i],
            ];
        }

        const sizing = { headerIconSize: 60, exactScale: 1 };
        const computeSizes = () => {
            const isMobile = window.innerWidth <= 1000;
            sizing.headerIconSize = isMobile ? 36 : 64;
            const firstWidth =
                iconElements[0]?.getBoundingClientRect().width ||
                sizing.headerIconSize;
            sizing.exactScale = sizing.headerIconSize / Math.max(1, firstWidth);
        };
        computeSizes();

        extras.sub = subheadlineRef.current;
        extras.pills = pillsRef.current;
        extras.underline = underlineRef.current;
        gsap.set([extras.sub, extras.pills, extras.underline], {
            opacity: 0,
            y: 8,
            pointerEvents: "none",
        });

        const stHero = ScrollTrigger.create({
            trigger: hero,
            start: "top top",
            end: `+=${window.innerHeight * 8}px`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                textSegments.forEach((segment) =>
                    gsap.set(segment, { opacity: 0 })
                );

                if (progress <= 0.3) {
                    const moveProgress = progress / 0.3;
                    const containerMoveY =
                        -window.innerHeight * 0.3 * moveProgress;

                    if (progress <= 0.15) {
                        const headerProgress = progress / 0.15;
                        const headerMoveY = -50 * headerProgress;
                        const headerOpacity = 1 - headerProgress;
                        gsap.set(heroHeader, {
                            xPercent: -50,
                            yPercent: -50,
                            y: headerMoveY,
                            opacity: headerOpacity,
                        });
                    } else {
                        gsap.set(heroHeader, {
                            xPercent: -50,
                            yPercent: -50,
                            y: -50,
                            opacity: 0,
                        });
                    }

                    if (duplicatesRef.current.length) {
                        duplicatesRef.current.forEach((d) => d.remove());
                        duplicatesRef.current = [];
                    }

                    hero.style.background = MINT_BG;

                    gsap.set(animatedIcons, {
                        x: 0,
                        y: containerMoveY,
                        scale: 1,
                        opacity: 1,
                    });
                    iconElements.forEach((icon, index) => {
                        const staggerDelay = index * 0.1;
                        const iconEnd = staggerDelay + 0.5;
                        const iconProgress = gsap.utils.mapRange(
                            staggerDelay,
                            iconEnd,
                            0,
                            1,
                            moveProgress
                        );
                        const clamped = Math.max(0, Math.min(1, iconProgress));
                        const startOffset = -containerMoveY;
                        const individualY = startOffset * (1 - clamped);
                        gsap.set(icon, { x: 0, y: individualY });
                    });
                } else if (progress <= 0.6) {
                    hero.style.background = MINT_BG;

                    const scaleProgress = (progress - 0.3) / 0.3;
                    gsap.set(heroHeader, {
                        xPercent: -50,
                        yPercent: -50,
                        y: -50,
                        opacity: 0,
                    });

                    if (duplicatesRef.current.length) {
                        duplicatesRef.current.forEach((d) => d.remove());
                        duplicatesRef.current = [];
                    }

                    const targetCenterY = window.innerHeight / 2;
                    const targetCenterX = window.innerWidth / 2;
                    const rect = animatedIcons.getBoundingClientRect();
                    const currentCenterX = rect.left + rect.width / 2;
                    const currentCenterY = rect.top + rect.height / 2;

                    const deltaX =
                        (targetCenterX - currentCenterX) * scaleProgress;
                    const deltaY =
                        (targetCenterY - currentCenterY) * scaleProgress;
                    const baseY = -window.innerHeight * 0.3;
                    const currentScale =
                        1 + (sizing.exactScale - 1) * scaleProgress;

                    gsap.set(animatedIcons, {
                        x: deltaX,
                        y: baseY + deltaY,
                        scale: currentScale,
                        opacity: 1,
                    });

                    iconElements.forEach((icon) =>
                        gsap.set(icon, { x: 0, y: 0 })
                    );
                } else if (progress <= 0.75) {
                    hero.style.background = MINT_BG;

                    const moveProgress = (progress - 0.6) / 0.15;
                    gsap.set(heroHeader, {
                        xPercent: -50,
                        yPercent: -50,
                        y: -50,
                        opacity: 0,
                    });

                    const targetCenterY = window.innerHeight / 2;
                    const targetCenterX = window.innerWidth / 2;
                    const rect = animatedIcons.getBoundingClientRect();
                    const currentCenterX = rect.left + rect.width / 2;
                    const currentCenterY = rect.top + rect.height / 2;
                    const deltaX = targetCenterX - currentCenterX;
                    const deltaY = targetCenterY - currentCenterY;
                    const baseY = -window.innerHeight * 0.3;

                    gsap.set(animatedIcons, {
                        x: deltaX,
                        y: baseY + deltaY,
                        scale: sizing.exactScale,
                        opacity: 0,
                    });

                    iconElements.forEach((icon) =>
                        gsap.set(icon, { x: 0, y: 0 })
                    );

                    if (!duplicatesRef.current.length) {
                        iconElements.forEach(() => {
                            const duplicate = document.createElement("div");
                            duplicate.className = "duplicate-icon";
                            Object.assign(duplicate.style, {
                                position: "absolute",
                                width: `${sizing.headerIconSize}px`,
                                height: `${sizing.headerIconSize}px`,
                            });
                            document.body.appendChild(duplicate);
                            duplicatesRef.current.push(duplicate);
                        });
                    }

                    duplicatesRef.current.forEach((duplicate, index) => {
                        if (!duplicate.firstChild && iconElements[index]) {
                            duplicate.appendChild(
                                iconElements[index].cloneNode(true)
                            );
                            const inner =
                                duplicate.querySelector(".animated-icon");
                            if (inner) {
                                inner.style.width = "100%";
                                inner.style.height = "100%";
                            }
                        }

                        if (index < placeholders.length) {
                            const iconRect =
                                iconElements[index].getBoundingClientRect();
                            const startCenterX =
                                iconRect.left + iconRect.width / 2;
                            const startCenterY =
                                iconRect.top + iconRect.height / 2;
                            const startPageX =
                                startCenterX + window.pageXOffset;
                            const startPageY =
                                startCenterY + window.pageYOffset;

                            const targetRect =
                                placeholders[index].getBoundingClientRect();
                            const targetCenterX =
                                targetRect.left + targetRect.width / 2;
                            const targetCenterY =
                                targetRect.top + targetRect.height / 2;
                            const targetPageX =
                                targetCenterX + window.pageXOffset;
                            const targetPageY =
                                targetCenterY + window.pageYOffset;

                            const moveX = targetPageX - startPageX;
                            const moveY = targetPageY - startPageY;

                            let currentX = 0;
                            let currentY = 0;

                            if (moveProgress <= 0.5) {
                                const verticalProgress = moveProgress / 0.5;
                                currentY = moveY * verticalProgress;
                            } else {
                                const horizontalProgress =
                                    (moveProgress - 0.5) / 0.5;
                                currentY = moveY;
                                currentX = moveX * horizontalProgress;
                            }

                            const finalPageX = startPageX + currentX;
                            const finalPageY = startPageY + currentY;

                            duplicate.style.left = `${
                                finalPageX - sizing.headerIconSize / 2
                            }px`;
                            duplicate.style.top = `${
                                finalPageY - sizing.headerIconSize / 2
                            }px`;
                            duplicate.style.opacity = "1";
                            duplicate.style.display = "flex";
                        }
                    });
                } else {
                    hero.style.background = MINT_BG;

                    gsap.set(heroHeader, {
                        xPercent: -50,
                        yPercent: -50,
                        y: -100,
                        opacity: 0,
                    });
                    gsap.set(animatedIcons, { opacity: 0 });

                    duplicatesRef.current.forEach((duplicate, index) => {
                        if (index < placeholders.length) {
                            const targetRect =
                                placeholders[index].getBoundingClientRect();
                            const targetCenterX =
                                targetRect.left + targetRect.width / 2;
                            const targetCenterY =
                                targetRect.top + targetRect.height / 2;
                            const targetPageX =
                                targetCenterX + window.pageXOffset;
                            const targetPageY =
                                targetCenterY + window.pageYOffset;

                            duplicate.style.left = `${
                                targetPageX - sizing.headerIconSize / 2
                            }px`;
                            duplicate.style.top = `${
                                targetPageY - sizing.headerIconSize / 2
                            }px`;
                            duplicate.style.opacity = "1";
                            duplicate.style.display = "flex";
                        }
                    });

                    textAnimationOrder.forEach((item, randomIndex) => {
                        const segmentStart = 0.75 + randomIndex * 0.03;
                        const segmentEnd = segmentStart + 0.015;
                        const segmentProgress = gsap.utils.mapRange(
                            segmentStart,
                            segmentEnd,
                            0,
                            1,
                            progress
                        );
                        const clamped = Math.max(
                            0,
                            Math.min(1, segmentProgress)
                        );
                        gsap.set(item.segment, { opacity: clamped });
                    });
                }

                const extrasStart = 0.8;
                const extrasEnd = 0.88;
                const eProg = gsap.utils.mapRange(
                    extrasStart,
                    extrasEnd,
                    0,
                    1,
                    progress
                );
                const eClamped = Math.max(0, Math.min(1, eProg));
                if (extras.sub && extras.pills && extras.underline) {
                    gsap.set([extras.sub, extras.pills, extras.underline], {
                        opacity: eClamped,
                        y: 8 * (1 - eClamped),
                    });
                    if (progress >= extrasEnd)
                        gsap.set([extras.sub, extras.pills], {
                            pointerEvents: "auto",
                        });
                }
            },
        });

        const onResize = () => {
            computeSizes();
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", onResize);

        return () => {
            stHero.kill();
            window.removeEventListener("resize", onResize);
            if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
            lenis.destroy();
            duplicatesRef.current.forEach((d) => d.remove());
            duplicatesRef.current = [];
        };
    }, []);

    useEffect(() => {
        if (!stepsRef.current) return;
        const slides = slidesWrapRef.current.querySelectorAll(".step-slide");
        const pills = dotsRef.current.querySelectorAll(".step-pill");
        const fills = dotsRef.current.querySelectorAll(".step-pill-fill");

        gsap.set(slides, { autoAlpha: 0, scale: 0.98 });
        if (slides[0]) gsap.set(slides[0], { autoAlpha: 1, scale: 1 });
        gsap.set(fills, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(pills[0], { opacity: 1 });
        currentStepRef.current = 0;

        const switchTo = (to) => {
            const from = currentStepRef.current;
            if (to === from) return;
            if (slides[from])
                gsap.to(slides[from], {
                    autoAlpha: 0,
                    scale: 0.98,
                    duration: 0.35,
                    ease: "power2.out",
                });
            if (slides[to])
                gsap.to(slides[to], {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.45,
                    ease: "power2.out",
                });
            currentStepRef.current = to;
        };

        const updatePills = (idx, local) => {
            pills.forEach((p, i) =>
                gsap.to(p, {
                    opacity: i === idx ? 1 : 0.6,
                    duration: 0.2,
                    ease: "linear",
                })
            );
            fills.forEach((f, i) => {
                const t =
                    i < idx
                        ? 1
                        : i === idx
                        ? Math.max(0, Math.min(1, local))
                        : 0;
                gsap.to(f, { scaleX: t, duration: 0.1, ease: "linear" });
            });
        };

        const stSteps = ScrollTrigger.create({
            trigger: stepsRef.current,
            start: "top top",
            end: `+=${window.innerHeight * slides.length}px`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const total = slides.length;
                const raw = self.progress * total;
                let idx = Math.floor(raw);
                if (idx >= total) idx = total - 1;
                let local = raw - idx;
                if (self.progress >= 0.999) local = 1;
                switchTo(idx);
                updatePills(idx, local);
            },
        });

        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);

        return () => {
            stSteps.kill();
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div className="text-[#141414]">
            <section
                ref={heroRef}
                style={{ background: MINT_BG }}
                className="hero relative w-screen h-[100svh] px-6 flex items-center justify-center flex-col overflow-hidden transition-colors duration-300"
            >
                <div
                    ref={headerRef}
                    className="hero-header absolute left-1/2 top-[48%] md:top-[47%] lg:top-[40%] -translate-x-1/2 -translate-y-1/2 w-[min(92vw,1000px)] text-center flex flex-col gap-6 z-30 [will-change:transform,opacity]"
                >
                    <h1 className="font-extrabold leading-[0.95] text-[11vw] md:text-[8vw] lg:text-[6vw]">
                        Catat keuangan lebih mudah menggunakan kaskuy
                    </h1>

                    <p className="font-normal text-[1.1rem] lg:text-[1.5rem]">
                        Kelola keuanganmu dengan cara yang lebih simpel dan
                        cepat.
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={() =>
                                lenisRef.current?.scrollTo(stepsRef.current, {
                                    offset: 0,
                                    duration: 1.1,
                                })
                            }
                            className="px-6 py-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition"
                        >
                            Coba sekarang
                        </button>
                    </div>
                </div>

                <div
                    ref={iconsWrapRef}
                    className="animated-icons fixed bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 [will-change:transform]"
                >
                    {ICONS.map((src, i) => (
                        <div
                            key={i}
                            className="animated-icon w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-[220px] lg:h-[220px]"
                        >
                            <img
                                src={src}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                <div className="relative flex flex-col items-center gap-4 mt-2">
                    <h1
                        className="animated-text relative max-w-[1000px] text-center text-[#141414]
            font-bold leading-tight mb-1 text-[clamp(2rem,5vw,4rem)]"
                    >
                        <span className="placeholder-icon inline-block align-middle w-[34px] h-[34px] mt-[-4px] lg:w-[60px] lg:h-[60px] lg:mt-[-10px] mx-[0.25em] [visibility:hidden]" />
                        <span className="text-segment opacity-0">
                            Mulai mencatat
                        </span>

                        <span className="placeholder-icon inline-block align-middle w-[34px] h-[34px] mt-[-4px] lg:w-[60px] lg:h-[60px] lg:mt-[-10px] mx-[0.25em] [visibility:hidden]" />
                        <span className="text-segment opacity-0">
                            seluruh transaksi anda
                        </span>

                        <span className="text-segment opacity-0"></span>

                        <span className="placeholder-icon inline-block align-middle w-[34px] h-[34px] mt-[-4px] lg:w-[60px] lg:h-[60px] lg:mt-[-10px] mx-[0.25em] [visibility:hidden]" />
                        <span className="text-segment opacity-0">
                            menggunakan
                        </span>

                        <span className="placeholder-icon inline-block align-middle w-[34px] h-[34px] mt-[-4px] lg:w-[60px] lg:h-[60px] lg:mt-[-10px] mx-[0.25em] [visibility:hidden]" />
                        <span className="text-segment opacity-0 bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                            kaskuy
                        </span>

                        <span className="placeholder-icon inline-block align-middle w-[34px] h-[34px] mt-[-4px] lg:w-[60px] lg:h-[60px] lg:mt-[-10px] mx-[0.25em] [visibility:hidden]" />
                        <span className="text-segment opacity-0"></span>

                        <div
                            ref={underlineRef}
                            className="mx-auto mt-3 h-px w-[min(60vw,560px)] bg-gradient-to-r from-transparent via-[#141414]/25 to-transparent opacity-0"
                            style={{ background: undefined }}
                        />
                    </h1>

                    <p
                        ref={subheadlineRef}
                        className="max-w-[720px] text-center text-[#141414]/80 text-[clamp(0.9rem,1.4vw,1.05rem)] leading-relaxed opacity-0 translate-y-2 pointer-events-none"
                    >
                        Catat cepat, kelompokan ke kategori, dan pantau arus kas
                        tanpa ribet.
                        <br />
                        semua dalam satu tempat.
                    </p>

                    <ul
                        ref={pillsRef}
                        className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#141414]/80 opacity-0 translate-y-2 pointer-events-none"
                    >
                        {[
                            "Foto struk menggunakan teknologi OCR",
                            "Mode offline ringan",
                            "Laporan bulanan",
                            "Tanpa iklan",
                        ].map((t) => (
                            <li
                                key={t}
                                className="rounded-full border border-green-400/30 bg-green-700/5 px-3 py-1"
                            >
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section
                ref={stepsRef}
                className="relative w-screen h-[100svh] bg-[#075E54] text-[#EAF6F3] overflow-hidden"
            >
                <div ref={slidesWrapRef} className="absolute inset-0">
                    <div className="step-slide absolute inset-0 grid place-items-center px-4 sm:px-6">
                        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
                            <div className="space-y-3 sm:space-y-4">
                                <h2 className="text-[clamp(1.9rem,4.5vw,3.6rem)] font-extrabold leading-[0.98]">
                                    Catat Sekilas, Rinci Kapan Saja
                                </h2>
                                <p className="text-[clamp(0.95rem,1.4vw,1.05rem)]/relaxed opacity-90">
                                    Tambahkan transaksi secepat mengetik chat,
                                    lengkapi detailnya nanti.
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 lg:mt-0">
                                {ICONS.slice(0, 3).map((s, i) => (
                                    <img
                                        key={i}
                                        src={s}
                                        alt=""
                                        className="w-full h-36 sm:h-44 lg:h-56 rounded-2xl object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="step-slide absolute inset-0 grid place-items-center px-4 sm:px-6">
                        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
                            <div className="space-y-3 sm:space-y-4">
                                <h2 className="text-[clamp(1.9rem,4.5vw,3.6rem)] font-extrabold leading-[0.98]">
                                    Kategori Pintar, Ikon Kesukaan
                                </h2>
                                <p className="text-[clamp(0.95rem,1.4vw,1.05rem)]/relaxed opacity-90">
                                    Semua rapi ke kategori. Pilih ikon yang
                                    bikin kamu betah mencatat.
                                </p>
                            </div>
                            <div className="grid grid-cols-5 gap-3 sm:gap-4 mt-6 lg:mt-0">
                                {ICONS.map((s, i) => (
                                    <img
                                        key={i}
                                        src={s}
                                        alt=""
                                        className="w-full h-20 sm:h-24 md:h-28 rounded-xl object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="step-slide absolute inset-0 grid place-items-center px-4 sm:px-6">
                        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
                            <div className="space-y-3 sm:space-y-4">
                                <h2 className="text-[clamp(1.9rem,4.5vw,3.6rem)] font-extrabold leading-[0.98]">
                                    Scan Struk Otomatis
                                </h2>
                                <p className="text-[clamp(0.95rem,1.4vw,1.05rem)]/relaxed opacity-90">
                                    Foto struk, angka dan tanggal langsung
                                    terbaca. Kamu tinggal cek.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 lg:mt-0">
                                {ICONS.slice(1, 5).map((s, i) => (
                                    <img
                                        key={i}
                                        src={s}
                                        alt=""
                                        className="w-full h-40 sm:h-52 lg:h-64 rounded-2xl object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="step-slide absolute inset-0 grid place-items-center px-4 sm:px-6">
                        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
                            <div className="space-y-3 sm:space-y-4">
                                <h2 className="text-[clamp(1.9rem,4.5vw,3.6rem)] font-extrabold leading-[0.98]">
                                    Laporan Bulanan Santai
                                </h2>
                                <p className="text-[clamp(0.95rem,1.4vw,1.05rem)]/relaxed opacity-90">
                                    Grafik sederhana, insight cepat. Lihat pola
                                    pemasukan dan pengeluaranmu.
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 lg:mt-0">
                                {ICONS.slice(0, 3).map((s, i) => (
                                    <img
                                        key={i}
                                        src={s}
                                        alt=""
                                        className="w-full h-36 sm:h-44 lg:h-56 rounded-2xl object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    ref={dotsRef}
                    className="absolute bottom-6 right-6 flex items-center gap-2"
                >
                    {[0, 1, 2, 3].map((i) => (
                        <span
                            key={i}
                            className="step-pill h-3 w-14 rounded-full bg-white/30 overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]"
                        >
                            <span className="step-pill-fill block h-full w-full scale-x-0 origin-left bg-white/90"></span>
                        </span>
                    ))}
                </div>
            </section>
            <section className="outro relative w-screen h-[100svh] px-6 flex items-center justify-center bg-[#e3e3db] text-[#141414] overflow-hidden">
                <h1 className="font-extrabold leading-none text-[10vw] lg:text-[6vw]">
                    Link di menit ke 5
                </h1>
            </section>
        </div>
    );
}
