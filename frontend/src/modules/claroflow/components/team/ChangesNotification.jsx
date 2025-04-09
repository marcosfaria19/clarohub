import { Button } from "modules/shared/components/ui/button";
import { motion } from "framer-motion";

const ChangeNotification = ({ hasChanges, onApply, onDiscard }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: hasChanges ? 1 : 0, y: hasChanges ? 0 : 20 }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="flex items-center gap-4 rounded-lg border border-border bg-background p-4 shadow-lg">
        <span className="text-sm font-medium">Alterações pendentes</span>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onDiscard}>
            Descartar
          </Button>
          <Button variant="default" size="sm" onClick={onApply}>
            Salvar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChangeNotification;
