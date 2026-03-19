"use client";
import React, { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Phone } from "lucide-react";

const iPhoneCallSlideButton: React.FC = () => {
  const [isAnswered, setIsAnswered] = useState(false);
  const answerX = useMotionValue(0);

  // Container width - using a fixed calculation
  const CONTAINER_WIDTH = 350; // Approximate container width
  const SLIDER_WIDTH = 64; // Width of slider button
  const MAX_DRAG = CONTAINER_WIDTH - SLIDER_WIDTH - 16; // 16px for padding

  // Background opacity for answer button
  const answerBgOpacity = useTransform(answerX, [0, MAX_DRAG], [0.3, 1]);

  // Text opacity
  const answerTextOpacity = useTransform(answerX, [0, MAX_DRAG / 2], [1, 0]);

  // Handle answer slide
  const handleAnswerDrag = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    // Check if dragged to the end
    if (offset >= MAX_DRAG * 0.9) {
      answerX.set(MAX_DRAG);

      // handleCallAnswer();
    }
  };

  const handleAnswerDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    // If not at the end, snap back
    if (offset < MAX_DRAG * 0.9 && !isAnswered) {
      answerX.set(0);
    }
  };

  // Call answer function
  const handleCallAnswer = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    console.log("✅ Call Answered!");

    // Your custom function here
    setTimeout(() => {
      // alert("Call Connected! 🎉");
      resetCall();
    }, 1500);
  };

  const resetCall = () => {
    setIsAnswered(false);
    answerX.set(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Incoming Call Screen */}
        <motion.div
          className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Answer Slide Button */}
          <div className="mb-6">
            <div className="relative h-16 bg-gray-700 bg-opacity-40 rounded-full overflow-hidden backdrop-blur-sm border border-gray-600">
              {/* Dynamic Background */}
              <motion.div
                className="absolute inset-0 bg-green-600 rounded-full"
                style={{ opacity: answerBgOpacity }}
              />

              {/* Slide to Answer Text */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                style={{ opacity: answerTextOpacity }}
              >
                <div className="flex items-center space-x-2">
                  <motion.svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </motion.svg>
                  <span className="text-white font-medium text-sm">
                    slide to answer
                  </span>
                </div>
              </motion.div>

              {/* Sliding Button */}
              <motion.div
                className={`absolute top-2 left-2 h-12 w-12 rounded-full shadow-lg flex items-center justify-center z-20 touch-none ${
                  isAnswered ? "bg-green-500" : "bg-green-600"
                }`}
                style={{ x: answerX }}
                drag="x"
                dragConstraints={{ left: 0, right: MAX_DRAG }}
                dragElastic={0}
                dragMomentum={false}
                onDrag={handleAnswerDrag}
                onDragEnd={handleAnswerDragEnd}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-5 h-5 text-white" fill="white" />
              </motion.div>

              {/* Success Overlay */}
              {isAnswered && (
                <motion.div
                  className="absolute inset-0 bg-green-500 flex items-center justify-center rounded-full z-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Phone className="w-8 h-8 text-white" fill="white" />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default iPhoneCallSlideButton;
