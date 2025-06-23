import React, { useState, useCallback, useMemo } from "react";
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
import { InfoIcon, AlertCircle, Loader2 } from "lucide-react";
import { useNewCard } from "modules/clarospark/hooks/useNewCard";

/**
 * AddIdeaModal - Modal otimizado para adicionar novas ideias
 * Implementa validação em tempo real, feedback visual e UX aprimorada
 * Integrado com WebSocket para atualizações em tempo real
 */
export default function AddIdeaModal({ subjects, onClose, userName, userId }) {
  // Estados locais otimizados
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Hook para gerenciamento de cards
  const { newCard, setNewCard, handleAddCard, validateCardData } = useNewCard(
    subjects,
    userId,
  );

  /**
   * Validação em tempo real dos campos
   * Memoizada para performance
   */
  const validateFields = useCallback(() => {
    const validation = validateCardData(newCard);

    if (!validation.isValid) {
      const errors = {};
      validation.errors.forEach((error) => {
        if (error.includes("Título")) errors.title = error;
        if (error.includes("Descrição")) errors.description = error;
        if (error.includes("Setor")) errors.subject = error;
      });
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return true;
  }, [newCard, validateCardData]);

  /**
   * Verifica se o formulário está válido
   * Memoizado para performance
   */
  const isFormValid = useMemo(() => {
    return (
      newCard.title?.trim() &&
      newCard.description?.trim() &&
      newCard.subject &&
      Object.keys(fieldErrors).length === 0
    );
  }, [newCard, fieldErrors]);

  /**
   * Atualização otimizada de campos
   * Memoizada para evitar re-renders desnecessários
   */
  const handleFieldChange = useCallback(
    (field, value) => {
      setNewCard((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Limpar erro específico do campo
      if (fieldErrors[field]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }

      // Limpar erro geral
      if (error) {
        setError(null);
      }
    },
    [setNewCard, fieldErrors, error],
  );

  /**
   * Submissão do formulário com validação completa
   * Otimizada com tratamento de erro robusto
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (isLoading) {
        return;
      }

      // Validação final
      if (!validateFields()) {
        setError("Por favor, corrija os erros nos campos destacados");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const cardToSubmit = {
          ...newCard,
          anonymous: isAnonymous ? 1 : 0,
        };

        const result = await handleAddCard(cardToSubmit);

        if (result.success) {
          onClose(); // Fechar modal após sucesso
        } else {
          throw new Error(result.errors?.[0] || "Falha ao criar ideia");
        }
      } catch (error) {
        console.error("AddIdeaModal: Erro ao criar ideia:", error);
        setError(error.message || "Erro ao adicionar ideia. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, validateFields, newCard, isAnonymous, handleAddCard, onClose],
  );

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Adicionar Nova Ideia</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Campo Título */}
        <div className="space-y-1">
          <Input
            placeholder="Título"
            maxLength={50}
            value={newCard.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            disabled={isLoading}
            className={fieldErrors.title ? "border-destructive" : ""}
            required
          />
          {fieldErrors.title && (
            <p className="text-sm text-destructive">{fieldErrors.title}</p>
          )}
        </div>

        {/* Campo Descrição */}
        <div className="space-y-1">
          <Textarea
            placeholder="Descrição"
            value={newCard.description}
            maxLength={1500}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            disabled={isLoading}
            className={fieldErrors.description ? "border-destructive" : ""}
            rows={4}
            required
          />
          {fieldErrors.description && (
            <p className="text-sm text-destructive">
              {fieldErrors.description}
            </p>
          )}
        </div>

        {/* Campo Setor */}
        <div className="space-y-1">
          <Select
            value={newCard.subject}
            onValueChange={(value) => handleFieldChange("subject", value)}
            disabled={isLoading}
            required
          >
            <SelectTrigger
              className={fieldErrors.subject ? "border-destructive" : ""}
            >
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
          {fieldErrors.subject && (
            <p className="text-sm text-destructive">{fieldErrors.subject}</p>
          )}
        </div>

        {/* Campo Autor */}
        <Input
          placeholder={userName}
          value={isAnonymous ? "Anônimo" : userName}
          disabled
        />

        {/* Checkbox Anônimo */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
            disabled={isLoading}
          />
          <div className="flex items-center space-x-1">
            <Label htmlFor="anonymous" className="cursor-pointer">
              Postar como anônimo
            </Label>
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

        {/* Mensagem de erro */}
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        {/* Botões de ação */}
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              "Adicionar"
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
