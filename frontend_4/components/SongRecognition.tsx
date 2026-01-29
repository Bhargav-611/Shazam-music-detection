"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { convertToWav } from "@/lib/wavConverter";

// Helper function to extract YouTube video ID from URL
function extractYouTubeId(url: string): string {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : "";
}

export default function SongRecognition() {
    const [recording, setRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<File | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        type: "success" | "error";
        message: string;
        details?: any;
    } | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioPreviewRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const webmBlob = new Blob(chunks, { type: "audio/webm" });

                const wavBlob = await convertToWav(webmBlob);
                const wavFile = new File([wavBlob], "recording.wav", {
                    type: "audio/wav",
                });

                const url = URL.createObjectURL(wavBlob);

                setAudioBlob(wavFile);
                setAudioUrl(url);
                setSelectedFile(null);
            };

            mediaRecorder.start();
            setRecording(true);
            setRecordingTime(0);
            setResult(null);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => {
                    const newTime = prev + 1;
                    // Auto-stop at 10 seconds
                    if (newTime >= 10) {
                        stopRecording();
                        return 10;
                    }
                    return newTime;
                });
            }, 1000);

            // Auto-stop at 10 seconds as backup
            setTimeout(() => {
                if (mediaRecorder.state === "recording") {
                    stopRecording();
                }
            }, 10000);
        } catch (error: any) {
            setResult({
                type: "error",
                message: `Error accessing microphone: ${error.message}. Please ensure microphone permissions are granted.`,
            });
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
            setRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setAudioUrl(url);
            setAudioBlob(file);
            stopRecording(); // Stop any ongoing recording
            setResult(null);
        }
    };

    const handleRecognize = async () => {
        if (!audioBlob) {
            setResult({
                type: "error",
                message: "Please record or upload an audio file first",
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const data = await api.recognizeSong(audioBlob);

            if (data.status === "success") {
                const song = data.result.song || {};
                setResult({
                    type: "success",
                    message: `🎵 Song Identified: ${song.title || "Unknown"}`,
                    details: {
                        songId: data.result.song_id,
                        score: data.result.score,
                        audioUrl: song.audio_url,
                    },
                });
            } else {
                setResult({
                    type: "error",
                    message: `❌ ${data.message || "Song not found in database"}`,
                    details:
                        "Try recording a longer clip (5-10 seconds) or ensure the song exists in the database.",
                });
            }
        } catch (error: any) {
            setResult({
                type: "error",
                message: `Error: ${error.message}`,
            });
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const hasAudio = audioBlob !== null;

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
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4"
                >
                    <svg
                        className="w-8 h-8 text-white"
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
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Recognize Song</h3>
                <p className="text-white/60">
                    Record or upload an audio clip (5-10 seconds) to identify the song
                </p>
            </div>

            {/* Recording Controls */}
            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    {!recording ? (
                        <motion.button
                            key="start"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            type="button"
                            onClick={startRecording}
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                initial={false}
                            />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                                </svg>
                                Start Recording
                            </span>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="recording"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="space-y-4"
                        >
                            {/* Recording Visualization */}
                            <div className="relative bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                                <div className="flex items-center justify-center gap-4">
                                    {/* Animated Waveform */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                                                animate={{
                                                    height: ["12px", "32px", "12px"],
                                                }}
                                                transition={{
                                                    duration: 0.6,
                                                    repeat: Infinity,
                                                    delay: i * 0.1,
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Timer */}
                                    <motion.div
                                        className="text-3xl font-mono font-bold text-white"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        {formatTime(recordingTime)}
                                    </motion.div>

                                    {/* Animated Waveform */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full"
                                                animate={{
                                                    height: ["12px", "32px", "12px"],
                                                }}
                                                transition={{
                                                    duration: 0.6,
                                                    repeat: Infinity,
                                                    delay: i * 0.1,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Recording Indicator */}
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <motion.div
                                        className="w-3 h-3 bg-red-500 rounded-full"
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                    <span className="text-white/80 text-sm font-medium">
                                        Recording...
                                    </span>
                                </div>
                            </div>

                            {/* Stop Button */}
                            <motion.button
                                type="button"
                                onClick={stopRecording}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold transition-colors"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <rect x="6" y="6" width="12" height="12" />
                                    </svg>
                                    Stop Recording
                                </span>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* File Upload */}
                <div className="relative">
                    <motion.label
                        htmlFor="audio-file"
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl text-white/80 hover:text-white hover:border-white/50 transition-all cursor-pointer"
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
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <span className="font-medium">Or Upload Audio File (.wav)</span>
                        <input
                            type="file"
                            id="audio-file"
                            accept=".wav"
                            onChange={handleFileChange}
                            disabled={loading || recording}
                            className="hidden"
                        />
                    </motion.label>
                    {selectedFile && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-white/70 text-center"
                        >
                            Selected: {selectedFile.name}
                        </motion.div>
                    )}
                </div>

                {/* Audio Preview */}
                <AnimatePresence>
                    {audioUrl && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <audio
                                ref={audioPreviewRef}
                                src={audioUrl}
                                controls
                                className="w-full rounded-xl"
                                style={{
                                    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Recognize Button */}
                <AnimatePresence>
                    {hasAudio && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            type="button"
                            onClick={handleRecognize}
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                initial={false}
                            />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        Analyzing...
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
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                        Recognize Song
                                    </>
                                )}
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

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
                                    <div className="mt-2 space-y-1">
                                        {typeof result.details === "object" ? (
                                            <>
                                                <p className="text-sm text-white/70">
                                                    <strong>Song ID:</strong> {result.details.songId}
                                                </p>
                                                <p className="text-sm text-white/70">
                                                    <strong>Match Score:</strong> {result.details.score}
                                                </p>
                                                {result.details.audioUrl && (
                                                    <div className="mt-4 space-y-2">
                                                        <p className="text-sm text-white/70">
                                                            <strong>YouTube:</strong>
                                                        </p>
                                                        <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                                                            <iframe
                                                                className="absolute top-0 left-0 w-full h-full"
                                                                src={`https://www.youtube.com/embed/${extractYouTubeId(result.details.audioUrl)}`}
                                                                title="YouTube video player"
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            />
                                                        </div>
                                                        <a
                                                            href={result.details.audioUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200 transition-colors mt-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                            </svg>
                                                            Watch on YouTube
                                                        </a>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-sm text-white/70">{result.details}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
