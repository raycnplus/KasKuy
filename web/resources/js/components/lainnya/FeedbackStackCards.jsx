import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

// Komponen Utama
export default function FeedbackStackCards({
    className = "",
    feedbacks = [],
    containerWidth = 600,
    containerHeight = 400,
    animationDelay = 0.3,
    animationStagger = 0.08,
    enableHover = true,
    cardWidth = 180,
    cardHeight = 140,
}) {
    const [cardPositions, setCardPositions] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const containerRef = useRef(null);
    const cardsRef = useRef([]);
    const isInitialized = useRef(false);
    const timelineRef = useRef(null);
    const hoverTimelineRef = useRef(null);

    const cardColors = [
        "bg-white/90 backdrop-blur-lg"
    ];

    const generateRandomPositions = () => {
        const positions = [];
        const padding = 0;
        const minDistance = 200;
        const maxAttempts = 50;

        feedbacks.forEach((_, index) => {
            const maxX = containerWidth - cardWidth - padding;
            const maxY = containerHeight - cardHeight - padding;
            let position;
            let attempts = 0;
            let validPosition = false;

            while (!validPosition && attempts < maxAttempts) {
                const x = Math.random() * (maxX - padding) + padding;
                const y = Math.random() * (maxY - padding) + padding;
                const tooClose = positions.some((pos) => {
                    const dx = pos.x - x;
                    const dy = pos.y - y;
                    return Math.sqrt(dx * dx + dy * dy) < minDistance;
                });

                if (!tooClose || positions.length === 0) {
                    position = {
                        x,
                        y,
                        rotation: (Math.random() - 0.5) * 25,
                        scale: 0.95 + Math.random() * 0.1,
                        zIndex: index + 1,
                    };
                    validPosition = true;
                }
                attempts++;
            }

            if (!validPosition) {
                position = {
                    x: Math.random() * (maxX - padding) + padding,
                    y: Math.random() * (maxY - padding) + padding,
                    rotation: (Math.random() - 0.5) * 25,
                    scale: 0.95 + Math.random() * 0.1,
                    zIndex: index + 1,
                };
            }

            positions.push(position);
        });

        return positions;
    };

    const getAvoidancePosition = (cardIndex, hoveredIndex) => {
        if (cardIndex === hoveredIndex) return cardPositions[cardIndex];
        const hoveredPos = cardPositions[hoveredIndex];
        const cardPos = cardPositions[cardIndex];
        const dx = cardPos.x - hoveredPos.x;
        const dy = cardPos.y - hoveredPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return cardPos;

        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        const baseDistance = 120;
        const pushDistance = Math.max(baseDistance, 200 - distance);

        const newX = Math.max(
            20,
            Math.min(
                containerWidth - cardWidth - 20,
                cardPos.x + normalizedDx * pushDistance
            )
        );
        const newY = Math.max(
            20,
            Math.min(
                containerHeight - cardHeight - 20,
                cardPos.y + normalizedDy * pushDistance
            )
        );

        return {
            ...cardPos,
            x: newX,
            y: newY,
            rotation: cardPos.rotation + (Math.random() - 0.5) * 15,
            scale: 0.85,
        };
    };

    useEffect(() => {
        if (feedbacks.length > 0 && !isInitialized.current) {
            setCardPositions(generateRandomPositions());
            isInitialized.current = true;
        }
    }, [feedbacks, containerWidth, containerHeight]);

    useEffect(() => {
        if (cardPositions.length > 0 && cardsRef.current.length > 0) {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
            timelineRef.current = gsap.timeline();
            cardsRef.current.forEach((card, index) => {
                if (card && cardPositions[index]) {
                    gsap.set(card, {
                        x: cardPositions[index].x,
                        y: cardPositions[index].y,
                        rotation: cardPositions[index].rotation,
                        scale: 0,
                        opacity: 0,
                        zIndex: cardPositions[index].zIndex,
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                    });
                    timelineRef.current.to(
                        card,
                        {
                            scale: cardPositions[index].scale,
                            opacity: 1,
                            duration: 0.8,
                            ease: "elastic.out(1, 0.6)",
                            delay: index * animationStagger,
                        },
                        animationDelay
                    );
                }
            });
        }
    }, [cardPositions]);

    useEffect(() => {
        if (cardPositions.length === 0) return;
        if (hoverTimelineRef.current) {
            hoverTimelineRef.current.kill();
        }
        hoverTimelineRef.current = gsap.timeline();
        cardsRef.current.forEach((card, index) => {
            if (!card) return;
            if (hoveredIndex === index) {
                hoverTimelineRef.current.to(
                    card,
                    {
                        x: cardPositions[index].x,
                        y: cardPositions[index].y,
                        rotation: 0,
                        scale: 1.08,
                        zIndex: 1000,
                        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                        duration: 0.4,
                        ease: "power2.out",
                    },
                    0
                );
            } else if (hoveredIndex !== -1) {
                const avoidPos = getAvoidancePosition(index, hoveredIndex);
                const delay = Math.abs(index - hoveredIndex) * 0.02;
                hoverTimelineRef.current.to(
                    card,
                    {
                        x: avoidPos.x,
                        y: avoidPos.y,
                        rotation: avoidPos.rotation,
                        scale: avoidPos.scale,
                        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
                        duration: 0.5,
                        ease: "power2.out",
                        delay: delay,
                    },
                    0
                );
            } else {
                const originalPos = cardPositions[index];
                hoverTimelineRef.current.to(
                    card,
                    {
                        x: originalPos.x,
                        y: originalPos.y,
                        rotation: originalPos.rotation,
                        scale: originalPos.scale,
                        zIndex: originalPos.zIndex,
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                        duration: 0.6,
                        ease: "power2.out",
                    },
                    0
                );
            }
        });
    }, [hoveredIndex]);

    useEffect(() => {
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
            if (hoverTimelineRef.current) {
                hoverTimelineRef.current.kill();
            }
        };
    }, []);

    const handleCardHover = (index) => {
        if (!enableHover) return;
        setHoveredIndex(index);
    };

    const handleContainerLeave = (e) => {
        if (!enableHover) return;
        if (!containerRef.current?.contains(e.relatedTarget)) {
            setHoveredIndex(-1);
        }
    };

    const reshuffleCards = () => {
        if (hoveredIndex !== -1) return;
        if (timelineRef.current) {
            timelineRef.current.kill();
        }
        if (hoverTimelineRef.current) {
            hoverTimelineRef.current.kill();
        }
        const newPositions = generateRandomPositions();
        const shuffleTimeline = gsap.timeline();
        cardsRef.current.forEach((card, index) => {
            if (card && cardPositions[index]) {
                shuffleTimeline.to(
                    card,
                    {
                        scale: 0,
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.in",
                    },
                    0
                );
            }
        });
        shuffleTimeline.call(() => {
            setCardPositions(newPositions);
            isInitialized.current = false;
            setTimeout(() => {
                isInitialized.current = true;
            }, 50);
        });
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden rounded-2xl sm:rounded-3xl w-screen ${className}`}
            style={{
                width: "100vw",
                height: containerHeight,
                backdropFilter: "blur(10px)",
            }}
            onMouseLeave={handleContainerLeave}
        >
            {feedbacks.map((feedback, index) => {
                const position = cardPositions[index];
                const colorClass = cardColors[index % cardColors.length];
                if (!position) return null;
                return (
                    <div
                        key={feedback.id}
                        ref={(el) => (cardsRef.current[index] = el)}
                        className={`absolute ${colorClass} rounded-2xl p-4 sm:p-5 cursor-pointer border border-white/30 backdrop-blur-sm`}
                        style={{
                            width: cardWidth,
                            height: cardHeight,
                            willChange: "transform, filter, opacity",
                        }}
                        onMouseEnter={() => handleCardHover(index)}
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center mb-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-inner">
                                    {feedback.name.charAt(0)}
                                </div>
                                <div className="ml-2 sm:ml-3">
                                    <div className="font-semibold text-pink-700 text-xs sm:text-sm leading-tight">
                                        {feedback.name}
                                    </div>
                                    <div className="text-xs text-pink-600/80 mt-0.5">
                                        {feedback.role}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 text-pink-700 text-xs leading-relaxed overflow-hidden">
                                <span className="italic">
                                    "{feedback.message.substring(0, 80)}..."
                                </span>
                            </div>
                            <div className="flex justify-end mt-3">
                                <div className="flex text-yellow-500 text-sm">
                                    {[...Array(feedback.rating)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="drop-shadow-sm"
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
