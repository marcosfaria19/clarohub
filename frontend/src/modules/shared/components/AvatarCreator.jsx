import React, { useState, useEffect, useCallback } from "react";
import { adventurerNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Button } from "modules/shared/components/ui/button";
import { Label } from "modules/shared/components/ui/label";
import { Input } from "modules/shared/components/ui/input";
import { Checkbox } from "modules/shared/components/ui/checkbox";
import { ChevronLeft, ChevronRight, RefreshCw, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "modules/shared/components/ui/dialog";
import axiosInstance from "services/axios";
import { toast } from "sonner";

const AvatarCreator = ({ currentAvatar, onClose, isOpen, userId, onSave }) => {
  const [avatarOptions, setAvatarOptions] = useState(() => {
    // Recupera as opções do localStorage ao inicializar
    const savedOptions = localStorage.getItem("avatarOptions");
    return JSON.parse(savedOptions)
      ? JSON.parse(savedOptions)
      : {
          seed: "Felix",
          glasses: ["variant03"],
          backgroundColor: ["000554"],
          mouth: ["variant05"],
          eyes: ["variant05"],
          eyebrows: ["variant05"],
          glassesProbability: 0,
        };
  });

  const [avatarUrl, setAvatarUrl] = useState("");

  // Define o avatar inicial apenas quando o diálogo é aberto
  useEffect(() => {
    if (isOpen && !currentAvatar) {
      setAvatarUrl(currentAvatar);
    }
  }, [currentAvatar, isOpen]);

  const optionsList = {
    glasses: adventurerNeutral.schema.properties.glasses?.default || [],
    mouth: adventurerNeutral.schema.properties.mouth?.default || [],
    eyes: adventurerNeutral.schema.properties.eyes?.default || [],
    eyebrows: adventurerNeutral.schema.properties.eyebrows?.default || [],
  };

  const optionLabels = {
    glasses: "Óculos",
    mouth: "Boca",
    eyes: "Olhos",
    eyebrows: "Sobrancelhas",
    backgroundColor: "Cor de Fundo",
    glassesProbability: "Habilitar Óculos",
  };

  const updateAvatar = useCallback(() => {
    try {
      const avatar = createAvatar(adventurerNeutral, {
        ...avatarOptions,
        backgroundColor: avatarOptions.backgroundColor
          ? [avatarOptions.backgroundColor]
          : undefined,
      });
      const svg = avatar.toDataUri();
      setAvatarUrl(svg);
    } catch (error) {
      console.error("Error creating avatar:", error);
    }
  }, [avatarOptions]);

  useEffect(() => {
    updateAvatar();
  }, [avatarOptions, updateAvatar]);

  const handleOptionChange = (option, value) => {
    setAvatarOptions((prev) => {
      if (option === "backgroundColor") {
        const cleanColor = value.replace("#", "");
        return { ...prev, [option]: [cleanColor] };
      }
      if (option === "glassesProbability") {
        return { ...prev, [option]: value ? 100 : 0 };
      }
      const optionsArray = optionsList[option];
      if (!optionsArray || optionsArray.length === 0) {
        console.error(`No options available for ${option}`);
        return prev;
      }
      const currentIndex = optionsArray.indexOf(
        prev[option]?.[0] || optionsArray[0],
      );
      const newIndex =
        (currentIndex + value + optionsArray.length) % optionsArray.length;

      return { ...prev, [option]: [optionsArray[newIndex]] };
    });
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}/avatar`, {
        avatarSvg: avatarUrl,
      });

      if (response.status === 200) {
        toast.success("Avatar atualizado!");
        onSave(avatarUrl);
        // Salva as opções do avatar no localStorage
        localStorage.setItem("avatarOptions", JSON.stringify(avatarOptions));
        onClose();
      } else {
        throw new Error("Falha ao salvar o avatar");
      }
    } catch (error) {
      console.error("Erro ao salvar avatar:", error);
      toast.error("Erro ao salvar o avatar.");
    }
  };

  const handleRandomize = () => {
    const randomOptions = {
      glasses: [getRandomOption(optionsList.glasses)],
      mouth: [getRandomOption(optionsList.mouth)],
      eyes: [getRandomOption(optionsList.eyes)],
      eyebrows: [getRandomOption(optionsList.eyebrows)],
      backgroundColor: [
        `${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`,
      ],
      glassesProbability: Math.random() < 0.5 ? 0 : 100,
    };
    setAvatarOptions(randomOptions);
  };

  const getRandomOption = (options) => {
    if (!options || options.length === 0) {
      console.error("No options available");
      return null;
    }
    return options[Math.floor(Math.random() * options.length)];
  };

  const renderOption = (option) => (
    <div className="flex items-center justify-between rounded-lg bg-primary p-2 text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleOptionChange(option, -1)}
        aria-label={`Anterior ${optionLabels[option]}`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Label className="text-sm font-medium text-primary-foreground">
        {optionLabels[option]}
      </Label>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleOptionChange(option, 1)}
        aria-label={`Próximo ${optionLabels[option]}`}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Meu Avatar</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="relative mb-6 md:mb-0">
            <img
              src={avatarUrl || currentAvatar}
              alt="Avatar"
              className="h-64 w-64 rounded-full border-4 border-primary shadow-xl transition-all duration-300 hover:shadow-2xl"
            />
            <Button
              onClick={handleRandomize}
              variant="outline"
              size="icon"
              className="absolute bottom-2 right-2 rounded-full bg-background p-2 shadow-md transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              aria-label="Randomizar avatar"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.keys(optionsList).map((option) => (
                <div key={option}>{renderOption(option)}</div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label
                  htmlFor="backgroundColor"
                  className="text-sm font-medium"
                >
                  {optionLabels.backgroundColor}
                </Label>
                <Input
                  type="color"
                  id="backgroundColor"
                  value={`#${avatarOptions.backgroundColor}`}
                  onChange={(e) =>
                    handleOptionChange("backgroundColor", e.target.value)
                  }
                  className="h-10 w-10 cursor-pointer rounded-md p-0 transition-all hover:shadow-md"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="glassesProbability"
                  checked={avatarOptions.glassesProbability === 100}
                  onCheckedChange={(checked) =>
                    handleOptionChange("glassesProbability", checked)
                  }
                  className="border-2 border-primary text-primary focus:ring-2 focus:ring-primary"
                />
                <Label
                  htmlFor="glassesProbability"
                  className="cursor-pointer text-sm font-medium"
                >
                  {optionLabels.glassesProbability}
                </Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="px-6">
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarCreator;
