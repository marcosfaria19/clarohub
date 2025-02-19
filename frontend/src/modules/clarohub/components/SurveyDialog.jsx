import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";
import { Checkbox } from "modules/shared/components/ui/checkbox";
import { useState } from "react";

const SurveyDialog = ({ show, onClose, onDismiss }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleParticipate = () => {
    window.open("https://forms.office.com/r/1KCGLCCspg", "_blank");
    if (dontShowAgain) onDismiss();
    onClose();
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div class="flex items-center gap-3">
            <img
              src="icons/flow.png"
              alt="Claro Flow Logo"
              class="h-auto w-9"
            />
            <span class="text-lg font-semibold">
              Ajude a construir o Claro Flow!
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-foreground">
            Estamos desenvolvendo uma nova aplicação para simplificar o
            tratamento de demandas. Sua opinião é essencial! A pesquisa leva
            apenas 5 minutos.
          </p>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked)}
            />
            <label
              htmlFor="dont-show"
              className="text-sm font-medium leading-none text-foreground/70"
            >
              Não mostrar novamente
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={handleParticipate}>Participar da pesquisa</Button>
            <Button variant="secondary" onClick={onClose}>
              Talvez depois
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyDialog;
