import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "modules/shared/components/ui/dialog";
import { Button } from "modules/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Label } from "modules/shared/components/ui/label";
import cidadesAtlas from "modules/clarohub/utils/cidadesAtlas";
import ufVisium from "modules/clarohub/utils/ufVisium";
import ufNuvem from "modules/clarohub/utils/ufNuvem";

export default function SublinkModal({ show, handleClose, selectedApp }) {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [options, setOptions] = useState([]);
  const [locationType, setLocationType] = useState("");

  useEffect(() => {
    if (selectedApp) {
      if (selectedApp.nome === "Atlas") {
        setOptions(Object.values(cidadesAtlas).flat().sort());
        setLocationType("Cidade");
      } else if (selectedApp.nome === "Visium") {
        setOptions(Object.values(ufVisium).flat());
        setLocationType("UF");
      } else if (selectedApp.nome === "Nuvem") {
        setOptions(Object.values(ufNuvem).flat().sort());
        setLocationType("UF");
      }
    }
  }, [selectedApp]);

  const handleLocationSelect = () => {
    const location = selectedLocation.trim().toLowerCase();
    if (!selectedApp) {
      console.warn("No selected app");
      return;
    }

    let selectedSubLink = null;

    if (selectedApp.nome === "Atlas") {
      for (const [subLinkName, cities] of Object.entries(cidadesAtlas)) {
        if (cities.map((city) => city.toLowerCase()).includes(location)) {
          selectedSubLink = selectedApp.subLinks.find(
            (subLink) =>
              subLink.nome.toLowerCase() === subLinkName.toLowerCase(),
          );
          break;
        }
      }
    } else if (selectedApp.nome === "Visium") {
      for (const [subLinkName, ufs] of Object.entries(ufVisium)) {
        if (ufs.map((uf) => uf.toLowerCase()).includes(location)) {
          selectedSubLink = selectedApp.subLinks.find(
            (subLink) =>
              subLink.nome.toLowerCase() === subLinkName.toLowerCase(),
          );
          break;
        }
      }
    } else if (selectedApp.nome === "Nuvem") {
      for (const [subLinkName, ufs] of Object.entries(ufNuvem)) {
        if (ufs.map((uf) => uf.toLowerCase()).includes(location)) {
          selectedSubLink = selectedApp.subLinks.find(
            (subLink) =>
              subLink.nome.toLowerCase() === subLinkName.toLowerCase(),
          );
          if (selectedSubLink) {
            console.log(selectedSubLink);
            const updatedSubLink = `${selectedSubLink.rota}%2F${selectedLocation}`;
            window.open(updatedSubLink, "_blank");
          }
          break;
        }
      }
    }

    if (selectedSubLink) {
      window.open(selectedSubLink.rota, "_blank");
    } else {
      console.warn(
        `${selectedApp.nome === "Atlas" ? "Cidade" : "UF"} não encontrada.`,
      );
      alert(
        `${selectedApp.nome === "Atlas" ? "Cidade" : "UF"} não encontrada.`,
      );
    }

    handleClose();
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selecione a {locationType}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              {locationType}
            </Label>
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleLocationSelect}>Selecionar</Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
