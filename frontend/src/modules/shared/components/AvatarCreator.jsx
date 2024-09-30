import React, { useState, useEffect } from "react";
import { adventurerNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Button } from "modules/shared/components/ui/button";
import { Label } from "modules/shared/components/ui/label";
import { Input } from "modules/shared/components/ui/input";
import { Checkbox } from "modules/shared/components/ui/checkbox";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

const AvatarCreator = ({ onSave, currentAvatar }) => {
  const [avatarOptions, setAvatarOptions] = useState({
    glasses: 0,
    mouth: 0,
    eyes: 0,
    eyebrows: 0,
    backgroundColor: "#ffffff",
    glassesProbability: 100,
  });

  const [avatarUrl, setAvatarUrl] = useState("");

  // Acessa as propriedades do adventurerNeutral
  const optionsList = adventurerNeutral.schema.properties;

  const optionLabels = {
    glasses: "Óculos",
    mouth: "Boca",
    eyes: "Olhos",
    eyebrows: "Sobrancelhas",
    backgroundColor: "Cor de Fundo",
    glassesProbability: "Habilitar Óculos",
  };

  const updateAvatar = async () => {
    try {
      const avatar = createAvatar(adventurerNeutral, {
        glasses: optionsList.glasses?.types[avatarOptions.glasses] || undefined,
        mouth: optionsList.mouth?.types[avatarOptions.mouth] || undefined,
        eyes: optionsList.eyes?.types[avatarOptions.eyes] || undefined,
        eyebrows:
          optionsList.eyebrows?.types[avatarOptions.eyebrows] || undefined,
        backgroundColor: avatarOptions.backgroundColor,
        glassesProbability: avatarOptions.glassesProbability,
      });

      const svg = await avatar.toDataUri();
      setAvatarUrl(svg);
    } catch (error) {
      console.error("Erro ao gerar avatar:", error);
    }
  };

  useEffect(() => {
    updateAvatar();
  }, [avatarOptions]);

  const handleOptionChange = (option, value) => {
    setAvatarOptions((prev) => {
      const optionsCount = optionsList[option]?.types.length || 0; // Usa safe navigation
      let newIndex;

      if (option === "backgroundColor") {
        return { ...prev, [option]: value };
      }
      if (option === "glassesProbability") {
        return { ...prev, [option]: value ? 100 : 0 };
      }

      newIndex = (prev[option] + value + optionsCount) % optionsCount;
      return { ...prev, [option]: newIndex };
    });
  };

  const handleSave = () => {
    onSave(avatarUrl);
  };

  const handleRandomize = () => {
    const randomOptions = {
      glasses: Math.floor(
        Math.random() * (optionsList.glasses?.types.length || 1),
      ),
      mouth: Math.floor(Math.random() * (optionsList.mouth?.types.length || 1)),
      eyes: Math.floor(Math.random() * (optionsList.eyes?.types.length || 1)),
      eyebrows: Math.floor(
        Math.random() * (optionsList.eyebrows?.types.length || 1),
      ),
      backgroundColor: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
      glassesProbability: Math.random() < 0.5 ? 0 : 100,
    };
    setAvatarOptions(randomOptions);
  };

  const renderOption = (option) => (
    <div className="flex items-center justify-between space-x-2 rounded-lg bg-secondary p-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleOptionChange(option, -1)}
        aria-label={`Anterior ${optionLabels[option]}`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex-1 text-center">
        <Label className="text-sm font-medium">{optionLabels[option]}</Label>
      </div>
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
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <img
          src={avatarUrl || currentAvatar}
          alt="Avatar"
          className="h-40 w-40 rounded-full border-4 border-primary"
        />
        <Button onClick={handleRandomize} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Randomizar
        </Button>
      </div>
      <div className="space-y-4">
        {Object.keys(optionLabels).map((option) => (
          <div key={option}>{renderOption(option)}</div>
        ))}
        <div className="space-y-2">
          <Label htmlFor="backgroundColor" className="text-sm font-medium">
            {optionLabels.backgroundColor}
          </Label>
          <Input
            type="color"
            id="backgroundColor"
            value={avatarOptions.backgroundColor}
            onChange={(e) =>
              handleOptionChange("backgroundColor", e.target.value)
            }
            className="h-10 w-full p-0"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="glassesProbability"
            checked={avatarOptions.glassesProbability === 100}
            onCheckedChange={(checked) =>
              handleOptionChange("glassesProbability", checked)
            }
          />
          <Label
            htmlFor="glassesProbability"
            className="cursor-pointer text-sm font-medium"
          >
            {optionLabels.glassesProbability}
          </Label>
        </div>
      </div>
      <Button onClick={handleSave} className="w-full">
        Salvar Avatar
      </Button>
    </div>
  );
};

export default AvatarCreator;
