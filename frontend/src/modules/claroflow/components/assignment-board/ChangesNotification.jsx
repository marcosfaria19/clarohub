import { Button } from "modules/shared/components/ui/button";
import { motion } from "framer-motion";

const ChangeNotification = ({ hasChanges, onApply, onDiscard }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: hasChanges ? 1 : 0, y: hasChanges ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="flex items-center gap-4 rounded-lg border border-border bg-background p-4 shadow-lg">
        <span className="text-sm font-medium">Mudanças foram feitas</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onDiscard}>
            Descartar
          </Button>
          <Button variant="default" size="sm" onClick={onApply}>
            Aplicar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChangeNotification;
