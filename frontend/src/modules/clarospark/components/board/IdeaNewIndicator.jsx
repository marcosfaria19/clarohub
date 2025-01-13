import { motion } from "framer-motion";

export default function NewIndicator({ isNew }) {
  if (!isNew) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute right-0 top-[-10px] flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-medium text-foreground"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#a344c7]"></span>
      </span>
      <span>Nova!</span>
    </motion.div>
  );
}
