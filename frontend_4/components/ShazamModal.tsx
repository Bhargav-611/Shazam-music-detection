"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import YouTubeUpload from "./YouTubeUpload";
import SongRecognition from "./SongRecognition";
import Image from "next/image";

interface ShazamModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ShazamModal({ isOpen, onClose }: ShazamModalProps) {
    const [activeTab, setActiveTab] = useState<"recognize" | "upload">("recognize");

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[99998]"
                        style={{ isolation: 'isolate' }}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto" style={{ isolation: 'isolate' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3, type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl my-auto bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 backdrop-blur-xl border-b border-white/10 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            animate={{
                                                rotate: [0, 360],
                                            }}
                                            transition={{
                                                duration: 20,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="w-12 h-12 rounded-xl overflow-hidden"
                                        >
                                            <Image
                                                src="/logo.png"
                                                alt="Swara Logo"
                                                className="w-full h-full object-contain"
                                                width={48}
                                                height={48}
                                            />
                                        </motion.div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">
                                                Swara
                                            </h2>
                                            <p className="text-sm text-white/60">
                                                Audio Fingerprinting Technology
                                            </p>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={onClose}
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </motion.button>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-2 mt-6">
                                    <motion.button
                                        onClick={() => setActiveTab("recognize")}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all relative overflow-hidden ${activeTab === "recognize"
                                            ? "text-white"
                                            : "text-white/60 hover:text-white/80"
                                            }`}
                                    >
                                        {activeTab === "recognize" && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
                                                transition={{ type: "spring", damping: 25 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                            Recognize Song
                                        </span>
                                    </motion.button>

                                    <motion.button
                                        onClick={() => setActiveTab("upload")}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all relative overflow-hidden ${activeTab === "upload"
                                            ? "text-white"
                                            : "text-white/60 hover:text-white/80"
                                            }`}
                                    >
                                        {activeTab === "upload" && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl"
                                                transition={{ type: "spring", damping: 25 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            </svg>
                                            Add Song
                                        </span>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {activeTab === "recognize" ? (
                                        <SongRecognition key="recognize" />
                                    ) : (
                                        <YouTubeUpload key="upload" />
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl p-4">
                                <div className="flex items-center justify-between text-xs text-white/50">
                                    <span>Audio Fingerprinting Technology</span>
                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.5, 1, 0.5],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="w-2 h-2 bg-green-500 rounded-full"
                                        />
                                        <span>Backend Connected</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
