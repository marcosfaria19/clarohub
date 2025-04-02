import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "modules/shared/components/ui/dialog";
import { Input } from "modules/shared/components/ui/input";
import { Button } from "modules/shared/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "modules/shared/components/ui/select";
import { Label } from "modules/shared/components/ui/label";
import useProjects from "modules/claroflow/hooks/useProjects";

const AddAssignment = ({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) => {
  const { projects, loading, error } = useProjects();

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Demanda" : "Adicionar Demanda"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              value={currentItem.name || ""}
              onChange={(e) => handleChange({ name: e.target.value })}
              className="h-9 bg-menu text-foreground/90"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="project">Projeto</Label>
            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p className="text-destructive">{error.message}</p>
            ) : (
              <Select
                name="project"
                disabled={isEditMode}
                value={currentItem.projectId || ""}
                onValueChange={(value) =>
                  handleChange({ name: "projectId", value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              disabled={!currentItem.projectId || !currentItem.name}
            >
              {isEditMode ? "Salvar" : "Adicionar"}
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignment;
