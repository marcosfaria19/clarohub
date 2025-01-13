import { motion } from "framer-motion";

export default function NewIndicator({ isNew }) {
  if (!isNew) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute right-2 top-2 flex items-center space-x-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-1 text-xs font-medium text-white shadow-lg"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
      </span>
      <span>Nova!</span>
    </motion.div>
  );
}
