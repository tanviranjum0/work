"use client";
import "./reorder.css";
import { Reorder, motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";

// Types
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  year: number;
  technologies: string[];
}

// Sample data
const initialItems: PortfolioItem[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    category: "Full Stack",
    description: "Scalable e-commerce solution with real-time analytics",
    year: 2024,
    technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    id: "2",
    title: "AI Analytics Dashboard",
    category: "Frontend",
    description: "Machine learning insights visualization platform",
    year: 2024,
    technologies: ["TypeScript", "D3.js", "Python", "TensorFlow"],
  },
  {
    id: "3",
    title: "Mobile Banking App",
    category: "Mobile",
    description: "Secure financial transactions with biometric auth",
    year: 2023,
    technologies: ["React Native", "Firebase", "Node.js"],
  },
  {
    id: "4",
    title: "Cloud Architecture",
    category: "DevOps",
    description: "Microservices infrastructure optimization",
    year: 2023,
    technologies: ["Kubernetes", "Docker", "AWS", "Terraform"],
  },
];

// Premium animation variants
const itemVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    y: -2,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  },
  drag: {
    scale: 1.05,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: { duration: 0.1 },
  },
};

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Premium Reorder Component
const PremiumPortfolioReorder = () => {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to keep dragged item in view
  useEffect(() => {
    const handleScroll = () => {
      // Custom scroll behavior during drag
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleReorder = (newOrder: PortfolioItem[]) => {
    setItems(newOrder);

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-light text-slate-800 mb-4 tracking-tight">
            Portfolio Works
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Drag to reorder projects based on your preference.
            <span className="block text-sm text-slate-500 mt-2">
              Professional curation with smooth interactions
            </span>
          </p>
        </motion.div>

        {/* Reorder Component */}
        <div ref={constraintsRef} className="relative">
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={handleReorder}
            className="space-y-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover="hover"
                  whileDrag="drag"
                  dragConstraints={constraintsRef}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <motion.div
                    className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 ${
                      selectedItem === item.id
                        ? "ring-2 ring-blue-500 ring-opacity-20"
                        : ""
                    }`}
                    onClick={() => handleItemClick(item.id)}
                    layout
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-3">
                          <motion.div
                            className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-white text-sm font-medium">
                              {item.id}
                            </span>
                          </motion.div>

                          <div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-1">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <span className="bg-slate-100 px-2 py-1 rounded-full">
                                {item.category}
                              </span>
                              <span>•</span>
                              <span>{item.year}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-600 mb-4 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {item.technologies.map((tech) => (
                            <motion.span
                              key={tech}
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                              }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <motion.div
                        className="flex-shrink-0 ml-4 opacity-60 hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg
                          className="w-6 h-6 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8h16M4 16h16"
                          />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {selectedItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="mt-4 pt-4 border-t border-slate-100"
                        >
                          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                            <div>
                              <span className="font-medium">Status:</span>{" "}
                              Completed
                            </div>
                            <div>
                              <span className="font-medium">Client:</span>{" "}
                              Enterprise
                            </div>
                            <div>
                              <span className="font-medium">Team Size:</span> 4
                              developers
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> 6
                              months
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {/* Visual Feedback for Dragging */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: items.length > 0 ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-center text-slate-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
                <p>Drag items to reorder</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center gap-4 mt-12"
        >
          <motion.button
            className="px-6 py-3 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-900 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Order
          </motion.button>
          <motion.button
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-full font-medium hover:bg-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setItems(initialItems)}
          >
            Reset to Default
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumPortfolioReorder;
