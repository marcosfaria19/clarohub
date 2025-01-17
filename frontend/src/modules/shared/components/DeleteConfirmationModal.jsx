import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";

const DeleteConfirmationModal = ({
  show,
  handleClose,
  handleDeleteConfirm,
}) => {
  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-sm text-muted-foreground">
          Tem certeza que deseja excluir este item?
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDeleteConfirm}>
            Excluir
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
