import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import { Input } from "modules/shared/components/ui/input";
import { Button } from "modules/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Label } from "modules/shared/components/ui/label";
import { useProjects } from "../hooks/useProjects";

const AddAssignment = ({
  show,
  handleClose,
  currentItem,
  handleChange,
  isEditMode,
}) => {
  const { projects, loading, error, addAssignmentToProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newAssignment = { name: currentItem.name };
      await addAssignmentToProject(selectedProject, newAssignment);
      handleClose(); // Fecha o modal após salvar
    } catch (err) {
      console.error("Erro ao adicionar demanda:", err);
    }
  };

  const handleSelectChange = (name) => (value) => {
    handleChange({ target: { name, value } });
    if (name === "project") {
      setSelectedProject(value);
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Demanda" : "Adicionar Demanda"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo e clique em{" "}
            {isEditMode ? "Salvar" : "Adicionar"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              value={currentItem.name}
              onChange={handleChange}
              className="h-9 bg-menu text-foreground/90"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="project">Projeto</Label>
            {loading ? (
              <p>Carregando projetos...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <Select
                name="project"
                value={selectedProject}
                onValueChange={handleSelectChange("project")}
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
            <Button type="submit" variant="primary" disabled={!selectedProject}>
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
