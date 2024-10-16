import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "modules/shared/components/ui/dialog";
import { Input } from "modules/shared/components/ui/input";
import { Textarea } from "modules/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "modules/shared/components/ui/select";
import { Button } from "modules/shared/components/ui/button";
import { Checkbox } from "modules/shared/components/ui/checkbox";
import { Label } from "modules/shared/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "modules/shared/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { useNewCard } from "../hooks/useNewCard";

export default function AddIdeaModal({ subjects, onClose, userName }) {
  const { newCard, setNewCard, handleAddCard } = useNewCard(subjects, userName);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cardToSubmit = {
      ...newCard,
      anonimous: isAnonymous ? 1 : 0,
    };
    const success = await handleAddCard(cardToSubmit);
    if (success) {
      onClose();
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Adicionar Nova Ideia</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input
          placeholder="Título"
          value={newCard.title}
          onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
          required
        />
        <Textarea
          placeholder="Descrição"
          value={newCard.description}
          onChange={(e) =>
            setNewCard({ ...newCard, description: e.target.value })
          }
          required
        />
        <Select
          value={newCard.subject}
          onValueChange={(value) => setNewCard({ ...newCard, subject: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma área" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder={userName}
          value={isAnonymous ? "Anônimo" : userName}
          disabled
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
          />
          <div className="flex items-center space-x-1">
            <Label htmlFor="anonymous">Postar como anônimo</Label>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 cursor-help text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Seu nome será ocultado no quadro, mas os gestores ainda
                    poderão vê-lo
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button type="submit">Adicionar</Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
