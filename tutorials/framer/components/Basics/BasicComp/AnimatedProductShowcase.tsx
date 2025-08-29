"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  features: string[];
}

interface ProductShowcaseProps {
  products: Product[];
  autoRotate?: boolean;
  rotationSpeed?: number;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  products,
  autoRotate = true,
  rotationSpeed = 10000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto rotation effect
  useEffect(() => {
    if (!autoRotate || isHovered || isDragging || products.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, rotationSpeed);

    return () => clearInterval(interval);
  }, [autoRotate, isHovered, isDragging, products.length, rotationSpeed]);

  // Drag to rotate functionality
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: any
  ) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (info.point.x - centerX) / 50;
    const y = (centerY - info.point.y) / 50;

    rotateX.set(y);
    rotateY.set(x);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToProduct = (index: number) => {
    setCurrentIndex(index);
  };

  const currentProduct = products[currentIndex];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* 3D Product Display */}
        <div
          className="relative aspect-square"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center"
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragStart={() => setIsDragging(true)}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{
              rotateX: springRotateX,
              rotateY: springRotateY,
              perspective: 1000,
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct.id}
                className="w-80 h-80 relative"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{
                  opacity: 1,
                  rotateY: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  },
                }}
                exit={{
                  opacity: 0,
                  rotateY: -90,
                  transition: {
                    duration: 0.3,
                  },
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain rounded-2xl shadow-2xl"
                  style={{
                    transformStyle: "preserve-3d",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  whileHover={{
                    rotateY: 5,
                    rotateX: -5,
                    transition: { duration: 0.3 },
                  }}
                />

                {/* Subtle 3D effect layers */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/20"
                  style={{
                    transform: "translateZ(20px)",
                    transformStyle: "preserve-3d",
                  }}
                />
                <motion.div
                  className="absolute inset-4 rounded-2xl border border-white/10"
                  style={{
                    transform: "translateZ(40px)",
                    transformStyle: "preserve-3d",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation Arrows */}
          {products.length > 1 && (
            <>
              <motion.button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg backdrop-blur-sm"
                onClick={prevProduct}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </motion.button>
              <motion.button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg backdrop-blur-sm"
                onClick={nextProduct}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                →
              </motion.button>
            </>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900">
                {currentProduct.name}
              </h2>

              <motion.p className="text-2xl font-semibold text-blue-600 mt-2">
                ${currentProduct.price}
              </motion.p>

              <p className="text-gray-600 mt-4 leading-relaxed">
                {currentProduct.description}
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <ul className="space-y-2">
                  {currentProduct.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: index * 0.1 },
                      }}
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <motion.button
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Add to Cart
              </motion.button>
            </motion.div>
          </AnimatePresence>

          {/* Product Indicators */}
          {products.length > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToProduct(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-blue-600 scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Example usage with sample data
const ExampleProductShowcase: React.FC = () => {
  const sampleProducts: Product[] = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      description:
        "Experience crystal-clear audio with our premium wireless headphones featuring noise cancellation and 30-hour battery life.",
      features: [
        "Active Noise Cancellation",
        "30-hour battery life",
        "Premium sound quality",
        "Comfortable over-ear design",
        "Bluetooth 5.0 connectivity",
      ],
    },
    {
      id: "2",
      name: "Smart Watch Pro",
      price: 249.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      description:
        "Stay connected with our feature-packed smartwatch that tracks your health, notifications, and daily activities.",
      features: [
        "Heart rate monitoring",
        "GPS tracking",
        "Water resistant up to 50m",
        "7-day battery life",
        "Customizable watch faces",
      ],
    },
    {
      id: "3",
      name: "Ultra Slim Laptop",
      price: 1299.99,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
      description:
        "Powerful performance in an ultra-slim design. Perfect for professionals and creatives on the go.",
      features: [
        "Intel Core i7 processor",
        "16GB RAM, 1TB SSD",
        "14-inch 4K display",
        "Thunderbolt 4 ports",
        "All-day battery life",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <ProductShowcase
        products={sampleProducts}
        autoRotate={true}
        rotationSpeed={5000}
      />
    </div>
  );
};

export default ExampleProductShowcase;
