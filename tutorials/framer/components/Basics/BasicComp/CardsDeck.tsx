"use client";
import React, { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface Card {
  id: string;
  title: string;
  content: string;
  color: string;
}

const StackedCardsDeck: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([
    { id: "1", title: "Card 1", content: "Swipe me away!", color: "#FF6B6B" },
    {
      id: "2",
      title: "Card 2",
      content: "Try swiping left or right",
      color: "#4ECDC4",
    },
    {
      id: "3",
      title: "Card 3",
      content: "Or click to flip me over",
      color: "#FFE66D",
    },
    {
      id: "4",
      title: "Card 4",
      content: "See the cool animations!",
      color: "#9b59b6",
    },
    { id: "5", title: "Card 5", content: "Last card!", color: "#3498db" },
  ]);

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const resetDeck = () => {
    setCards([
      { id: "1", title: "Card 1", content: "Swipe me away!", color: "#FF6B6B" },
      {
        id: "2",
        title: "Card 2",
        content: "Try swiping left or right",
        color: "#4ECDC4",
      },
      {
        id: "3",
        title: "Card 3",
        content: "Or click to flip me over",
        color: "#FFE66D",
      },
      {
        id: "4",
        title: "Card 4",
        content: "See the cool animations!",
        color: "#9b59b6",
      },
      { id: "5", title: "Card 5", content: "Last card!", color: "#3498db" },
    ]);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Stacked Cards Deck</h1>
      <p style={styles.subtitle}>Swipe cards away or click to flip</p>

      <div style={styles.cardsContainer}>
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              index={index}
              total={cards.length}
              onRemove={removeCard}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.emptyState}
          >
            <h3>All cards gone!</h3>
            <button style={styles.resetButton} onClick={resetDeck}>
              Reset Deck
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

interface CardProps {
  card: Card;
  index: number;
  total: number;
  onRemove: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ card, index, total, onRemove }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-30, 0, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (Math.abs(info.offset.x) > 150) {
      // Swiped far enough - remove card
      onRemove(card.id);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      style={{
        ...styles.cardWrapper,
        zIndex: total - index,
        y: index * 2,
        scale: 1 - index * 0.05,
        opacity: opacity,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        style={{
          ...styles.card,
          x,
          rotate,
          backgroundColor: card.color,
        }}
        onClick={handleFlip}
      >
        <motion.div
          style={styles.cardContent}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isFlipped ? (
            <div style={styles.front}>
              <h3>{card.title}</h3>
              <p>{card.content}</p>
              <span style={styles.flipHint}>Click to flip</span>
            </div>
          ) : (
            <div style={styles.back}>
              <h3>Card Back</h3>
              <p>This is the back of the card</p>
              <span style={styles.flipHint}>Click to return</span>
            </div>
          )}
        </motion.div>

        <div style={styles.swipeHint}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 8L18 12L14 16M10 8L6 12L10 16"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="2"
            />
          </svg>
          <span>Swipe to remove</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    padding: "2rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "0.5rem",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    marginBottom: "2rem",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  cardsContainer: {
    position: "relative",
    width: "300px",
    height: "400px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "280px",
    height: "380px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    cursor: "grab",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    color: "white",
    transformStyle: "preserve-3d",
  },
  front: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  back: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    transform: "rotateY(180deg)",
  },
  flipHint: {
    marginTop: "1rem",
    fontSize: "0.8rem",
    opacity: 0.7,
  },
  swipeHint: {
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.8rem",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  emptyState: {
    textAlign: "center",
    color: "white",
    padding: "2rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
  },
  resetButton: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "white",
    color: "#764ba2",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
};

// Add hover effect for reset button
const hoverStyle = `
  .reset-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

// Add styles to document
document.head.insertAdjacentHTML("beforeend", `<style>${hoverStyle}</style>`);

export default StackedCardsDeck;
