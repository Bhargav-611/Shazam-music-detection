"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TOTAL_FRAMES = 192;

export default function HeadphoneScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Preload all images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            const frameNumber = i.toString().padStart(3, "0");
            img.src = `/frames/ezgif-frame-${frameNumber}.jpg`;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) {
                    setImagesLoaded(true);
                }
            };

            loadedImages[i - 1] = img;
        }

        setImages(loadedImages);
    }, []);

    // Update canvas based on scroll
    useEffect(() => {
        if (!imagesLoaded || images.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const render = () => {
            const scrollFraction = scrollYProgress.get();
            const frameIndex = Math.min(
                Math.floor(scrollFraction * TOTAL_FRAMES),
                TOTAL_FRAMES - 1
            );

            const img = images[frameIndex];
            if (img && img.complete) {
                // Always use full viewport width
                const containerWidth = window.innerWidth;
                const imgAspect = img.width / img.height;
                const renderWidth = containerWidth;
                const renderHeight = containerWidth / imgAspect;

                const scale = window.devicePixelRatio || 1;
                canvas.width = renderWidth * scale;
                canvas.height = renderHeight * scale;
                canvas.style.width = `${renderWidth}px`;
                canvas.style.height = `${renderHeight}px`;

                context.scale(scale, scale);
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, renderWidth, renderHeight);
            }
        };

        const unsubscribe = scrollYProgress.on("change", render);
        render(); // Initial render

        return () => unsubscribe();
    }, [scrollYProgress, images, imagesLoaded]);

    const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    return (
        <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
            {/* Sticky container for canvas */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black">
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-black/40 pointer-events-none z-0" />

                {/* Animated gradient orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full blur-3xl"
                            style={{
                                width: `${400 + i * 100}px`,
                                height: `${400 + i * 100}px`,
                                left: `${15 * i}%`,
                                top: `${20 * i}%`,
                                background: i % 2 === 0
                                    ? "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.1) 50%, transparent 70%)"
                                    : "radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, rgba(167, 139, 250, 0.1) 50%, transparent 70%)",
                            }}
                            animate={{
                                x: [0, 50, -50, 0],
                                y: [0, -50, 50, 0],
                                scale: [1, 1.1, 0.9, 1],
                            }}
                            transition={{
                                duration: 15 + i * 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {!imagesLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                            <div className="text-white text-2xl mb-4 font-light">Loading Experience...</div>
                            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className="relative z-10 w-screen object-cover"
                    style={{
                        opacity: imagesLoaded ? 1 : 0,
                        transition: "opacity 0.5s ease-in-out",
                    }}
                />

                {/* Overlay text */}
                <motion.div
                    style={{
                        opacity: titleOpacity,
                        y: titleY,
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none z-10"
                >
                    <h2
                        className="text-6xl md:text-8xl font-bold mb-6"
                        style={{
                            background:
                                "linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #EC4899 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Swara
                    </h2>
                    <p className="text-2xl md:text-4xl text-white/90 font-light mb-4">
                        Audio Fingerprinting
                    </p>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl text-center">
                        Experience the magic of sound recognition
                    </p>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    style={{ opacity: titleOpacity }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none"
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-white/60 text-sm">Scroll Down</span>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <svg
                                className="w-6 h-6 text-white/60"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
