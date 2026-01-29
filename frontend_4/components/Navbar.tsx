"use client";

import { useEffect, useState } from "react";
import ShazamModal from "./ShazamModal";
import Image from "next/image";
import { motion } from "framer-motion";

const MotionImage = motion.create(Image);;


export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isShazamOpen, setIsShazamOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
                    ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
                    : "bg-transparent"
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <MotionImage
                            src="/logo.png"
                            alt="Swara Logo"
                            width={32}
                            height={32}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-transform hover:scale-110"
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                        />
                        <h1
                            className="text-xl sm:text-2xl font-bold"
                            style={{
                                background: "linear-gradient(135deg, #F97316 0%, #EC4899 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Swara
                        </h1>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#home"
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            Home
                        </a>
                        <a
                            href="#about"
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="#features"
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            Features
                        </a>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Find Song Button */}
                        <motion.button
                            onClick={() => setIsShazamOpen(true)}
                            className="relative px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-white text-sm sm:text-base overflow-hidden group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                    />
                                </svg>
                                Find Song
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                initial={false}
                            />
                            <motion.div
                                className="absolute inset-0 rounded-full blur-xl opacity-50"
                                style={{
                                    background: "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)",
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* Modal rendered outside navbar to prevent clipping */}
            <ShazamModal isOpen={isShazamOpen} onClose={() => setIsShazamOpen(false)} />
        </>
    );
}
