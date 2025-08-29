"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  skills: string[];
  social: {
    twitter: string;
    linkedin: string;
    github: string;
  };
  stats: {
    projects: number;
    followers: number;
    following: number;
  };
}

const AnimatedProfileShowcase: React.FC = () => {
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  const profiles: Profile[] = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "Frontend Developer",
      avatar: "👨‍💻",
      bio: "Passionate about creating beautiful and functional user interfaces with React and TypeScript.",
      skills: ["React", "TypeScript", "Framer Motion", "CSS", "UI/UX"],
      social: {
        twitter: "@alexj",
        linkedin: "alexjohnson",
        github: "alexjdev",
      },
      stats: {
        projects: 24,
        followers: 1240,
        following: 320,
      },
    },
    {
      id: "2",
      name: "Sarah Miller",
      role: "UX Designer",
      avatar: "👩‍🎨",
      bio: "Designing experiences that users love. Focused on accessibility and intuitive interfaces.",
      skills: [
        "Figma",
        "UI Design",
        "User Research",
        "Prototyping",
        "Illustration",
      ],
      social: {
        twitter: "@sarahm",
        linkedin: "sarahmiller",
        github: "sarahdesign",
      },
      stats: {
        projects: 18,
        followers: 1860,
        following: 420,
      },
    },
    {
      id: "3",
      name: "Michael Chen",
      role: "Full Stack Developer",
      avatar: "👨‍🔧",
      bio: "Building scalable applications from database to deployment. DevOps enthusiast and open source contributor.",
      skills: ["Node.js", "Python", "AWS", "Docker", "MongoDB"],
      social: {
        twitter: "@michaelc",
        linkedin: "michaelchen",
        github: "michaeldev",
      },
      stats: {
        projects: 32,
        followers: 2100,
        following: 280,
      },
    },
  ];

  const handleFlip = (id: string) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={styles.container}>
      <motion.h1
        style={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Team Profiles
      </motion.h1>
      <motion.p
        style={styles.subtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Hover or tap on a card to flip and see details
      </motion.p>

      <div style={styles.profilesContainer}>
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isFlipped={flipped[profile.id] || false}
            onFlip={() => handleFlip(profile.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface ProfileCardProps {
  profile: Profile;
  isFlipped: boolean;
  onFlip: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isFlipped,
  onFlip,
}) => {
  return (
    <div style={styles.cardWrapper}>
      <motion.div
        style={styles.card}
        onClick={onFlip}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          style={styles.cardInner}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Front of the card */}
          <motion.div
            style={styles.cardFront}
            initial={false}
            animate={{ opacity: isFlipped ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div style={styles.avatar}>{profile.avatar}</div>
            <h3 style={styles.name}>{profile.name}</h3>
            <p style={styles.role}>{profile.role}</p>
            <div style={styles.skills}>
              {profile.skills.slice(0, 3).map((skill, index) => (
                <span key={index} style={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>
            <motion.div
              style={styles.flipHint}
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Hover or tap to flip
            </motion.div>
          </motion.div>

          {/* Back of the card */}
          <motion.div
            style={styles.cardBack}
            initial={false}
            animate={{ opacity: isFlipped ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 style={styles.name}>About {profile.name.split(" ")[0]}</h3>
            <p style={styles.bio}>{profile.bio}</p>

            <div style={styles.skillsSection}>
              <h4 style={styles.sectionTitle}>Skills</h4>
              <div style={styles.skillsGrid}>
                {profile.skills.map((skill, index) => (
                  <span key={index} style={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={styles.stats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{profile.stats.projects}</span>
                <span style={styles.statLabel}>Projects</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{profile.stats.followers}</span>
                <span style={styles.statLabel}>Followers</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNumber}>{profile.stats.following}</span>
                <span style={styles.statLabel}>Following</span>
              </div>
            </div>

            <div style={styles.socialLinks}>
              <span style={styles.socialLink}>🐦 {profile.social.twitter}</span>
              <span style={styles.socialLink}>
                💼 {profile.social.linkedin}
              </span>
              <span style={styles.socialLink}>🐙 {profile.social.github}</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "white",
    marginBottom: "0.5rem",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "1rem",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: "3rem",
  },
  profilesContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2rem",
    maxWidth: "1200px",
  },
  cardWrapper: {
    perspective: "1000px",
    width: "300px",
    height: "400px",
  },
  card: {
    width: "100%",
    height: "100%",
    cursor: "pointer",
  },
  cardInner: {
    position: "relative",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
  },
  cardFront: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
  },
  cardBack: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    transform: "rotateY(180deg)",
    overflowY: "auto",
  },
  avatar: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  name: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#2c3e50",
    margin: "0 0 0.5rem 0",
    textAlign: "center",
  },
  role: {
    fontSize: "1rem",
    color: "#7f8c8d",
    margin: "0 0 1.5rem 0",
    textAlign: "center",
  },
  bio: {
    fontSize: "0.9rem",
    color: "#34495e",
    lineHeight: "1.5",
    margin: "0 0 1.5rem 0",
  },
  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    justifyContent: "center",
    marginBottom: "2rem",
  },
  skillsSection: {
    marginBottom: "1.5rem",
  },
  skillsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  skillTag: {
    padding: "0.3rem 0.8rem",
    backgroundColor: "#f1f2f6",
    color: "#2c3e50",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2c3e50",
    margin: "0 0 0.8rem 0",
  },
  stats: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    padding: "1rem 0",
    borderTop: "1px solid #f1f2f6",
    borderBottom: "1px solid #f1f2f6",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNumber: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#667eea",
  },
  statLabel: {
    fontSize: "0.7rem",
    color: "#7f8c8d",
    textTransform: "uppercase",
    marginTop: "0.3rem",
  },
  socialLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  socialLink: {
    fontSize: "0.8rem",
    color: "#7f8c8d",
  },
  flipHint: {
    position: "absolute",
    bottom: "1rem",
    fontSize: "0.8rem",
    color: "#7f8c8d",
  },
};

export default AnimatedProfileShowcase;
