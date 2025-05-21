import React from "react";
import { Button } from "modules/shared/components/ui/button";
import { Textarea } from "modules/shared/components/ui/textarea";
import { Copy, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function StepResultado({
  currentStep,
  textoPadraoConcatenado,
  item,
  setShowSGDTable,
  setCurrentStep,
}) {
  if (currentStep !== 2) return null;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(textoPadraoConcatenado)
      .then(() => toast.success("Texto copiado para a área de transferência."))
      .catch(() => toast.error("Falha ao copiar o texto."));
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {textoPadraoConcatenado ? (
        <div className="mt-4 flex w-full flex-col items-center space-y-4 text-center text-sm">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
          <span className="text-green-600">
            <span className="text-lg font-semibold">Sucesso!</span>
            <br />
            Dados copiados para a área de transferência
          </span>

          {item?.SGD?.length > 0 && (
            <Button
              onClick={() => setShowSGDTable(true)}
              variant="outline"
              size="sm"
            >
              Ver fechamentos sugeridos no SGD
            </Button>
          )}

          <Textarea
            readOnly
            className="h-40 w-full resize-none text-sm"
            value={textoPadraoConcatenado}
          />

          <div className="flex w-full justify-between">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <Button onClick={handleCopy} variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" /> Copiar novamente
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="mb-4 h-16 w-16 text-primary" />
          <p className="text-sm text-muted-foreground">
            Aguardando dados processados...
          </p>
        </div>
      )}
    </div>
  );
}
