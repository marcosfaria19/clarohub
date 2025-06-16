import { useState, useEffect } from "react";
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

import cardFiles from "../assets/cards.json";
import logoFiles from "../assets/logos.json";

const AddApp = ({
  show,
  handleClose,
  handleSave,
  currentItem,
  handleChange,
  isEditMode,
}) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [logoCardUrls, setLogoCardUrls] = useState([]);
  const [logoListUrls, setLogoListUrls] = useState([]);

  useEffect(() => {
    setImageUrls(cardFiles.map((f) => `/assets/cards/${f}`));
    setLogoCardUrls(logoFiles.map((f) => `/assets/logos/${f}`));
    setLogoListUrls(logoFiles.map((f) => `/assets/logos/${f}`));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  const handleSelectChange = (name) => (value) => {
    handleChange({ target: { name, value } });
  };

  const renderSelectOptions = (urls) =>
    urls.map((url) => (
      <SelectItem key={url} value={url}>
        <div className="flex items-center gap-2">
          <img src={url} alt="" className="h-5 w-5 object-contain" />
          <span>{url.split("/").pop()}</span>
        </div>
      </SelectItem>
    ));

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar App" : "Adicionar Novo App"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo e clique em{" "}
            {isEditMode ? "Salvar" : "Adicionar"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              value={currentItem.nome}
              onChange={handleChange}
              className="h-9 bg-menu text-foreground/90"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="info">Descrição</Label>
            <Input
              id="info"
              name="info"
              value={currentItem.info}
              onChange={handleChange}
              className="h-9 bg-menu text-foreground/90"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="imagemUrl">Imagem Card</Label>
            <Select
              name="imagemUrl"
              value={currentItem.imagemUrl}
              onValueChange={handleSelectChange("imagemUrl")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>{renderSelectOptions(imageUrls)}</SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="logoCard">Logo Card</Label>
            <Select
              name="logoCard"
              value={currentItem.logoCard}
              onValueChange={handleSelectChange("logoCard")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>{renderSelectOptions(logoCardUrls)}</SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="logoList">Logo Lista</Label>
            <Select
              name="logoList"
              value={currentItem.logoList}
              onValueChange={handleSelectChange("logoList")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>{renderSelectOptions(logoListUrls)}</SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rota">Rota</Label>
            <Input
              id="rota"
              name="rota"
              value={currentItem.rota}
              onChange={handleChange}
              className="h-9 bg-menu text-foreground/90"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="familia">Família</Label>
            <Input
              id="familia"
              name="familia"
              value={currentItem.familia}
              onChange={handleChange}
              className="h-9 bg-menu text-foreground/90"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="acesso">Acesso</Label>
            <Select
              name="acesso"
              value={currentItem.acesso}
              onValueChange={handleSelectChange("acesso")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" variant="primary">
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

export default AddApp;
