import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import ufNuvem from "modules/clarohub/utils/ufNuvem";
import { toast } from "sonner";

// Configurações de cada aplicação
const appConfig = {
  Atlas: {
    dictionary: cidadesAtlas,
    locationType: "Cidade",
    sort: true,
    transform: (val) => {
      return (
        Object.entries(cidadesAtlas).find(([key, values]) =>
          values.some((v) => v.toLowerCase() === val.toLowerCase()),
        )?.[0] || null
      );
    },
  },
  Visium: {
    dictionary: null,
    locationType: "Tecnologia",
    sort: false,
    transform: (val) => val,
  },
  Nuvem: {
    dictionary: ufNuvem,
    locationType: "UF",
    sort: true,
    transform: (val) => {
      return (
        Object.entries(ufNuvem).find(([key, values]) =>
          values.some((v) => v.toLowerCase() === val.toLowerCase()),
        )?.[0] || null
      );
    },
  },
  "Consultar SLA": {
    dictionary: null,
    locationType: "Diretório",
    sort: false,
    transform: (val) => val,
  },
};

export default function SublinkModal({ show, handleClose, selectedApp }) {
  const [selectedLocation, setSelectedLocation] = useState("");

  // Obtém a configuração com base na aplicação selecionada
  const config = useMemo(() => {
    return selectedApp ? appConfig[selectedApp.nome] : null;
  }, [selectedApp]);

  // Reseta a seleção ao mudar a aplicação
  useEffect(() => {
    setSelectedLocation("");
  }, [selectedApp]);

  // Calcula as opções para o Select com base na configuração e nos sublinks
  const options = useMemo(() => {
    if (!selectedApp) return [];
    const { dictionary, sort } = config || {};
    if (dictionary) {
      let opts = Object.values(dictionary).flat();
      return sort ? opts.sort() : opts;
    }
    // Se não há dicionário, usa os nomes dos sublinks como opções
    return selectedApp.subLinks.map((s) => s.nome);
  }, [selectedApp, config]);

  // Função para tratar a seleção do item
  const handleLocationSelect = useCallback(() => {
    if (!selectedApp || !selectedLocation) {
      toast.error("Por favor, selecione uma opção.");
      return;
    }

    // Aplica a transformação definida na configuração (se houver)
    const transformedOption =
      config?.transform(selectedLocation) || selectedLocation;

    // Procura o sublink correspondente de forma case insensitive
    const selectedSubLink = selectedApp.subLinks.find(
      (subLink) =>
        subLink.nome.toLowerCase() === transformedOption.toLowerCase(),
    );

    if (!selectedSubLink) {
      toast.error(`${config?.locationType || ""} não encontrada.`);
      return;
    }

    // Formata a URL (ajustando para a aplicação "Nuvem" se necessário)
    let url = selectedSubLink.rota;
    if (selectedApp.nome === "Nuvem") {
      url = `${url}%2F${selectedLocation}`;
    }
    window.open(url, "_blank");
    handleClose();
  }, [selectedApp, selectedLocation, config, handleClose]);

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Selecione qual {config?.locationType}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              {config?.locationType}
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
              onClick={handleLocationSelect}
              className="flex-1 sm:flex-none"
            >
              Selecionar
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
