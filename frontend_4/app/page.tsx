"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadphoneScroll from "@/components/HeadphoneScroll";

export default function Home() {
    return (
        <>
            <Navbar />

            <main className="bg-gradient-to-br from-gray-900 via-purple-900 to-black">
                {/* Scrollytelling Animation - FIRST */}
                <HeadphoneScroll />

                {/* Hero/Features Section - AFTER animation */}
                <section className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-gray-900 via-purple-900 to-black">
                    <div className="max-w-6xl mx-auto text-center space-y-8">
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                            className="flex justify-center mb-8"
                        >
                            <img
                                src="/logo.png"
                                alt="Swara Logo"
                                className="w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl"
                            />
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-6xl md:text-8xl font-bold"
                            style={{
                                background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #EC4899 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Swara
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-2xl md:text-3xl text-white/80 font-light"
                        >
                            Audio Fingerprinting, Redefined
                        </motion.p>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
                        >
                            Identify any song in seconds using cutting-edge audio fingerprinting technology.
                            Upload songs from YouTube or recognize music from your microphone.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="pt-8"
                        >
                            <p className="text-white/60 mb-4">
                                Click "Find Song" in the navigation above to get started
                            </p>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16"
                        >
                            <FeatureCard
                                icon={
                                    <svg
                                        className="w-8 h-8"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                        />
                                    </svg>
                                }
                                title="Instant Recognition"
                                description="Record any song with your microphone and get instant matches from our database"
                            />
                            <FeatureCard
                                icon={
                                    <svg
                                        className="w-8 h-8"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                }
                                title="YouTube Integration"
                                description="Add songs to the database directly from YouTube URLs with automatic fingerprinting"
                            />
                            <FeatureCard
                                icon={
                                    <svg
                                        className="w-8 h-8"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                }
                                title="Fast & Accurate"
                                description="Advanced audio fingerprinting algorithms ensure quick and precise song identification"
                            />
                        </motion.div>

                        {/* Animated Background Elements */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"
                                style={{
                                    width: `${300 + i * 100}px`,
                                    height: `${300 + i * 100}px`,
                                    left: `${20 * i}%`,
                                    top: `${30 * i}%`,
                                }}
                                animate={{
                                    x: [0, 100, 0],
                                    y: [0, -100, 0],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 10 + i * 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4"
        >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-white/60">{description}</p>
        </motion.div>
    );
}
