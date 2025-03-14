import { motion } from "framer-motion";

export default function Layout({ children }) {
  return (
    <div className="bg-cyberBg text-white min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto"
      >
        {children}
      </motion.div>
    </div>
  );
}
