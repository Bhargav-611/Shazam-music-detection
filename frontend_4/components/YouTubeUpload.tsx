"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export default function YouTubeUpload() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        type: "success" | "error";
        message: string;
        details?: string;
    } | null>(null);

    const isValidYouTubeUrl = (url: string) => {
        const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return pattern.test(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url.trim()) {
            setResult({ type: "error", message: "Please enter a YouTube URL" });
            return;
        }

        if (!isValidYouTubeUrl(url)) {
            setResult({ type: "error", message: "Please enter a valid YouTube URL" });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            console.log("Starting YouTube upload for URL:", url);
            const data = await api.uploadYouTube(url);
            console.log("Upload successful, response:", data);
            setResult({
                type: "success",
                message: data.message || "Song processing started in background",
                details:
                    "The song is being processed and will be added to the database shortly.",
            });
            setUrl("");
        } catch (error: any) {
            console.error("Upload failed:", error);
            setResult({
                type: "error",
                message: error.message || "Failed to upload song",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="text-center space-y-2">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl mb-4"
                >
                    <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Add Song from YouTube</h3>
                <p className="text-white/60">
                    Enter a YouTube URL to add the song to the database
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="youtube-url" className="text-sm font-medium text-white/80">
                        YouTube URL
                    </label>
                    <motion.div
                        whileFocus={{ scale: 1.01 }}
                        className="relative"
                    >
                        <input
                            type="url"
                            id="youtube-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {url && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                type="button"
                                onClick={() => setUrl("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
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
                        )}
                    </motion.div>
                </div>

                <motion.button
                    type="submit"
                    disabled={loading || !url.trim()}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={false}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                                Processing...
                            </>
                        ) : (
                            <>
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
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                Upload Song
                            </>
                        )}
                    </span>
                </motion.button>
            </form>

            {/* Result Message */}
            <AnimatePresence mode="wait">
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 rounded-xl backdrop-blur-sm border ${result.type === "success"
                                ? "bg-green-500/20 border-green-500/30"
                                : "bg-red-500/20 border-red-500/30"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                className="flex-shrink-0"
                            >
                                {result.type === "success" ? (
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
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
                                    </div>
                                )}
                            </motion.div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white">{result.message}</h4>
                                {result.details && (
                                    <p className="text-sm text-white/70 mt-1">{result.details}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
