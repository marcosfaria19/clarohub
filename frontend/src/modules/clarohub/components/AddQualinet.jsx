import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";
import { Input } from "modules/shared/components/ui/input";
import { Label } from "modules/shared/components/ui/label";

function AddQualinet({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) {
  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Cadastro" : "Adicionar Cadastro"}
          </DialogTitle>
        </DialogHeader>
        <form>
          <div className="space-y-4">
            <div>
              <Label htmlFor="formCINome" className="mb-3">
                CI_NOME
              </Label>
              <Input
                type="text"
                name="CI_NOME"
                value={currentItem.CI_NOME || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formNumContrato" className="mb-3">
                NUM_CONTRATO
              </Label>
              <Input
                type="text"
                name="NUM_CONTRATO"
                value={currentItem.NUM_CONTRATO || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formDtCadastro" className="mb-3">
                DT_CADASTRO
              </Label>
              <Input
                type="text"
                name="DT_CADASTRO"
                value={currentItem.DT_CADASTRO || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formEndCompleto" className="mb-3">
                END_COMPLETO
              </Label>
              <Input
                type="text"
                name="END_COMPLETO"
                value={currentItem.END_COMPLETO || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formCodNode" className="mb-3">
                COD_NODE
              </Label>
              <Input
                type="text"
                name="COD_NODE"
                value={currentItem.COD_NODE || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="formUf" className="mb-3">
                UF
              </Label>
              <Input
                type="text"
                name="UF"
                value={currentItem.UF || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>

        <DialogFooter className="space-x-2">
          <Button variant="primary" onClick={handleSave}>
            {isEditMode ? "Salvar" : "Adicionar"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddQualinet;
