// components/HeartBeat.tsx
"use client";

import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";

export default function HeartBeat() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="text-rose-500"
    >
      <FiHeart className="text-4xl" />
    </motion.div>
  );
}
