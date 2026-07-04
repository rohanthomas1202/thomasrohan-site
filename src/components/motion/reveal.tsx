"use client";
import { motion, type Variants } from "motion/react";
import { SPRING } from "./springs";

const parentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: SPRING.reveal },
};

export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={parentVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
