import React, { useState, useEffect, useCallback, useMemo } from "react";
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
 * EditIdeaModal - Modal otimizado para edição de ideias
 * Implementa validação em tempo real, detecção de mudanças e UX aprimorada
 * Integrado com WebSocket para atualizações em tempo real
 */
export default function EditIdeaModal({
  idea,
  subjects = [],
  onClose,
  userName = "",
  userId,
  onUpdate,
  isUpdating = false,
}) {
  // Estados locais otimizados
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Hook para gerenciamento de cards
  const { editCard, setEditCard, handleUpdateCard } = useNewCard(
    subjects,
    userId,
    idea,
  );

  /**
   * Dados originais da ideia para comparação
   * Memoizado para evitar re-criação desnecessária
   */
  const originalData = useMemo(() => {
    if (!idea) return null;

    return {
      title: idea.title || "",
      description: idea.description || "",
      subject: idea.subject || "",
      anonymous: idea.anonymous || 0,
    };
  }, [idea]);

  /**
   * Inicialização do estado anônimo
   * Otimizado para evitar atualizações desnecessárias
   */
  useEffect(() => {
    if (idea && typeof idea.anonymous === "number") {
      setIsAnonymous(idea.anonymous === 1);
    }
  }, [idea]);

  /**
   * Detecção de mudanças nos campos
   * Memoizado para performance otimizada
   */
  const detectChanges = useCallback(() => {
    if (!originalData || !editCard) return false;

    const currentAnonymous = isAnonymous ? 1 : 0;

    return (
      editCard.title !== originalData.title ||
      editCard.description !== originalData.description ||
      editCard.subject !== originalData.subject ||
      currentAnonymous !== originalData.anonymous
    );
  }, [editCard, isAnonymous, originalData]);

  /**
   * Atualiza estado de mudanças quando campos mudam
   */
  useEffect(() => {
    const changesDetected = detectChanges();
    setHasChanges(changesDetected);

    // Limpar erro geral quando há mudanças
    if (changesDetected && error) {
      setError(null);
    }
  }, [detectChanges, error]);

  /**
   * Validação em tempo real dos campos
   * Memoizada para performance
   */
  const validateFields = useCallback(() => {
    const errors = {};

    // Validação do título
    if (!editCard?.title?.trim()) {
      errors.title = "Título é obrigatório";
    } else if (editCard.title.trim().length > 50) {
      errors.title = "Título deve ter no máximo 50 caracteres";
    }

    // Validação da descrição
    if (!editCard?.description?.trim()) {
      errors.description = "Descrição é obrigatória";
    } else if (editCard.description.trim().length > 1500) {
      errors.description = "Descrição deve ter no máximo 1500 caracteres";
    }

    // Validação do setor
    if (!editCard?.subject) {
      errors.subject = "Setor é obrigatório";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [editCard]);

  /**
   * Validação em tempo real quando campos mudam
   */
  useEffect(() => {
    if (editCard) {
      validateFields();
    }
  }, [editCard, validateFields]);

  /**
   * Atualização otimizada de campos
   * Memoizada para evitar re-renders desnecessários
   */
  const handleFieldChange = useCallback(
    (field, value) => {
      setEditCard((prev) => ({
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
    },
    [setEditCard, fieldErrors],
  );

  /**
   * Submissão do formulário com validação completa
   * Otimizada com tratamento de erro robusto
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Verificações de segurança
      if (!idea?._id) {
        console.error("EditIdeaModal: ID da ideia não encontrado");
        setError("Erro interno: ID da ideia não encontrado");
        return;
      }

      if (isLoading || isUpdating) {
        return;
      }

      // Validação final
      if (!validateFields()) {
        setError("Por favor, corrija os erros nos campos destacados");
        return;
      }

      // Verificar se há mudanças
      if (!hasChanges) {
        onClose();
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const cardToUpdate = {
          ...editCard,
          anonymous: isAnonymous ? 1 : 0,
        };

        // Atualizar via API
        const result = await handleUpdateCard(cardToUpdate, idea._id);

        if (result.success) {
          // Notificar componente pai para atualização otimista
          if (onUpdate) {
            await onUpdate(result.data);
          }

          // Modal será fechado pelo componente pai após sucesso
        } else {
          throw new Error(result.errors?.[0] || "Falha ao atualizar ideia");
        }
      } catch (error) {
        console.error("EditIdeaModal: Erro ao atualizar ideia:", error);
        setError(
          error.message || "Erro ao salvar alterações. Tente novamente.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      idea,
      isLoading,
      isUpdating,
      validateFields,
      hasChanges,
      onClose,
      editCard,
      isAnonymous,
      handleUpdateCard,
      onUpdate,
    ],
  );

  // Verificações de segurança para renderização
  if (!idea) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Erro</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>Ideia não encontrada</p>
        </div>
      </DialogContent>
    );
  }

  if (!editCard) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Carregando...</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </DialogContent>
    );
  }

  const isProcessing = isLoading || isUpdating;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editar Ideia</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Campo Título */}
        <div className="space-y-1">
          <Input
            placeholder="Título"
            maxLength={50}
            value={editCard.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            disabled
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
            value={editCard.description}
            maxLength={1500}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            disabled
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
            value={editCard.subject}
            onValueChange={(value) => handleFieldChange("subject", value)}
            disabled={isProcessing}
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
            disabled
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
            disabled={
              isProcessing || !hasChanges || Object.keys(fieldErrors).length > 0
            }
            className="min-w-[100px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
