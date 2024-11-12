import React, { useState, useEffect, useMemo } from "react";
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
import { toast } from "sonner";

export default function SublinkModal({ show, handleClose, selectedApp }) {
  const [selectedLocation, setSelectedLocation] = useState("");

  const { options, locationType } = useMemo(() => {
    if (!selectedApp) return { options: [], locationType: "" };

    switch (selectedApp.nome) {
      case "Atlas":
        return {
          options: Object.values(cidadesAtlas).flat().sort(),
          locationType: "Cidade",
        };
      case "Visium":
        return {
          options: Object.values(ufVisium).flat(),
          locationType: "UF",
        };
      case "Nuvem":
        return {
          options: Object.values(ufNuvem).flat().sort(),
          locationType: "UF",
        };
      default:
        return { options: [], locationType: "" };
    }
  }, [selectedApp]);

  useEffect(() => {
    setSelectedLocation("");
  }, [selectedApp]);

  const handleLocationSelect = () => {
    if (!selectedApp || !selectedLocation) {
      toast.error("Por favor, selecione uma localização.");
      return;
    }

    const location = selectedLocation.trim().toLowerCase();
    let selectedSubLink = null;
    let locationData;

    switch (selectedApp.nome) {
      case "Atlas":
        locationData = cidadesAtlas;
        break;
      case "Visium":
        locationData = ufVisium;
        break;
      case "Nuvem":
        locationData = ufNuvem;
        break;
      default:
        toast.error("Aplicativo não reconhecido.");
        return;
    }

    for (const [subLinkName, locations] of Object.entries(locationData)) {
      if (locations.map((loc) => loc.toLowerCase()).includes(location)) {
        selectedSubLink = selectedApp.subLinks.find(
          (subLink) => subLink.nome.toLowerCase() === subLinkName.toLowerCase(),
        );
        break;
      }
    }

    if (selectedSubLink) {
      let url = selectedSubLink.rota;
      if (selectedApp.nome === "Nuvem") {
        url = `${url}%2F${selectedLocation}`;
      }
      window.open(url, "_blank");
      handleClose();
    } else {
      toast.error(`${locationType} não encontrada.`);
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Selecione a {locationType}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              {locationType}
            </Label>
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <div className="mt-4 flex gap-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleLocationSelect}
              className="flex-1 sm:flex-none"
            >
              Selecionar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
