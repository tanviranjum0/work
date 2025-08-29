"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, Download } from "lucide-react";

export default function IOSDownloadButton() {
  const [downloading, setDownloading] = useState(false);
  const [installed, setInstalled] = useState(false);

  const handleClick = () => {
    if (!downloading && !installed) {
      setDownloading(true);
      setTimeout(() => {
        setDownloading(false);
        setInstalled(true);
      }, 4000); // simulate install time
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.button
        onClick={handleClick}
        className="relative w-28 h-28 rounded-2xl flex items-center justify-center overflow-hidden"
        style={{
          background: installed
            ? "#34C759"
            : "linear-gradient(145deg, #007AFF, #0051A8)",
          boxShadow: installed
            ? "0 0 25px rgba(52,199,89,0.6)"
            : "0 4px 10px rgba(0,0,0,0.3)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Default Download State */}
        <AnimatePresence mode="wait">
          {!downloading && !installed && (
            <motion.div
              key="download"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-white"
            >
              <Download className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">Download</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Downloading Progress Circle */}
        <AnimatePresence mode="wait">
          {downloading && (
            <motion.div
              key="progress"
              className="relative w-16 h-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.svg viewBox="0 0 36 36" className="w-16 h-16 absolute">
                <motion.path
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                />
              </motion.svg>
              <Download className="absolute w-6 h-6 text-white inset-0 m-auto animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Installed State */}
        <AnimatePresence>
          {installed && (
            <motion.div
              key="installed"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex flex-col items-center text-white"
            >
              <Check className="w-7 h-7 mb-1" />
              <span className="text-sm font-semibold">Installed</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
