import { useState, useEffect } from "react";
import axios from "axios";
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
import axiosInstance from "services/axios";

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
    const fetchUrls = async () => {
      try {
        const cardsResponse = await axiosInstance.get(`/apps/cards`);
        const logosResponse = await axiosInstance.get(`/apps/logos`);

        setImageUrls(
          cardsResponse.data.map((filename) => `/assets/cards/${filename}`),
        );
        setLogoCardUrls(
          logosResponse.data.map((filename) => `/assets/logos/${filename}`),
        );
        setLogoListUrls(
          logosResponse.data.map((filename) => `/assets/logos/${filename}`),
        );
      } catch (error) {
        console.error("Erro ao buscar URLs de imagens e logos", error);
      }
    };

    fetchUrls();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

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
            <Label htmlFor="imagemUrl">Imagem Card</Label>
            <Select
              name="imagemUrl"
              value={currentItem.imagemUrl}
              onValueChange={handleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {imageUrls.map((url) => (
                  <SelectItem key={url} value={url}>
                    {url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="logoCard">Logo Card</Label>
            <Select
              name="logoCard"
              value={currentItem.logoCard}
              onValueChange={handleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {logoCardUrls.map((url) => (
                  <SelectItem key={url} value={url}>
                    {url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="logoList">Logo Lista</Label>
            <Select
              name="logoList"
              value={currentItem.logoList}
              onValueChange={handleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {logoListUrls.map((url) => (
                  <SelectItem key={url} value={url}>
                    {url}
                  </SelectItem>
                ))}
              </SelectContent>
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
              onValueChange={handleChange}
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
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="outline">
              {isEditMode ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddApp;
