"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpandableCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  children?: React.ReactNode;
  className?: string;
}

const demoProps: ExpandableCardProps = {
  title: "Beautiful Landscape",
  description:
    "Experience the serenity of nature with this stunning landscape view.",
  imageUrl:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  className: "my-custom-card",
};

const ExpandableCard: React.FC<ExpandableCardProps> = () => {
  const { title, description, imageUrl, children, className } = demoProps;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(true);
  };

  const handleCloseModal = () => {
    setIsExpanded(false);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Spring animation configuration
  const springConfig = {
    damping: 25,
    stiffness: 200,
  };

  // Card variants for animation
  const cardVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  // Modal backdrop variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Modal content variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: springConfig,
    },
  };

  return (
    <>
      {/* Card */}
      <motion.div
        className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-200 ${className}`}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={handleCardClick}
        layoutId={`card-${title}`}
      >
        {imageUrl && (
          <motion.div
            className="w-full h-48 overflow-hidden"
            layoutId={`image-${title}`}
          >
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <div className="p-6">
          <motion.h3
            className="text-xl font-semibold text-gray-800 mb-2"
            layoutId={`title-${title}`}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-gray-600 line-clamp-3"
            layoutId={`description-${title}`}
          >
            {description}
          </motion.p>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={handleModalClick}
              layoutId={`card-${title}`}
            >
              {imageUrl && (
                <motion.div
                  className="w-full h-64 overflow-hidden"
                  layoutId={`image-${title}`}
                >
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}

              <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
                <motion.h2
                  className="text-3xl font-bold text-gray-800 mb-4"
                  layoutId={`title-${title}`}
                >
                  {title}
                </motion.h2>

                <motion.p
                  className="text-gray-700 text-lg mb-6 leading-relaxed"
                  layoutId={`description-${title}`}
                >
                  {description}
                </motion.p>

                {children && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {children}
                  </motion.div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 flex justify-end">
                <motion.button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseModal}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExpandableCard;
