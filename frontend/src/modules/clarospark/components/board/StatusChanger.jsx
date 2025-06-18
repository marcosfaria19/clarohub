import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import { Badge } from "modules/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";
import statusConfig from "modules/clarospark/utils/statusConfig";
import { useState } from "react";
import { Label } from "modules/shared/components/ui/label";
import { Textarea } from "modules/shared/components/ui/textarea";

export default function StatusChanger({
  currentStatus,
  onChange,
  disabled,
  showReason = true,
}) {
  const { color } = statusConfig[currentStatus] || {};
  const statusOptions = Object.keys(statusConfig).filter(
    (status) => status !== currentStatus,
  );

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (showReason && !reason.trim()) return;

    onChange({
      newStatus: selectedStatus,
      reason: showReason ? reason : "Alterado pelo gestor",
    });

    setReason("");
    setIsDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger disabled={disabled} className="focus:outline-none">
          <Badge variant="outline" className={`${color} min-w-24 border-0`}>
            {currentStatus}
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusOptions.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusSelect(status)}
            >
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">
              Confirmar alteração de status
            </DialogTitle>
            <p className="text-sm">
              Tem certeza que deseja alterar o status para{" "}
              <strong>{selectedStatus}</strong>?
            </p>
          </DialogHeader>

          {showReason && (
            <div className="grid gap-4">
              <Label htmlFor="reason" className="text-sm font-medium">
                Motivo/Resumo <span className="text-warning">*</span>
              </Label>
              <Textarea
                maxLength={200}
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Descreva o motivo da alteração"
                className="min-h-[100px] w-full rounded-md border p-2 text-sm"
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={handleConfirm}
              disabled={showReason && !reason.trim()}
            >
              Confirmar
            </Button>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
