const { Button } = require("modules/shared/components/ui/button");
const { useState } = require("react");

/**
 * RegionalSelector
 * Componente responsável por permitir a seleção da regional primária e secundária.
 *
 * Props:
 * - initialPrimary: Valor inicial para a regional primária.
 * - initialSecondary: Valor inicial para a regional secundária.
 * - onSave: Função chamada ao confirmar a seleção, passando as regionals selecionadas.
 */
const RegionalSelector = ({
  initialPrimary,
  initialSecondary,
  onSave,
  onClose,
}) => {
  const regions = [
    "RSI",
    "RBS",
    "RRS",
    "RPS",
    "RSC",
    "RNO",
    "RCO",
    "RNE",
    "RRE",
    "RMG",
  ];
  const [step, setStep] = useState(1);
  const [primary, setPrimary] = useState(initialPrimary);
  const [secondary, setSecondary] = useState(initialSecondary);

  // Função para confirmar a seleção e enviar os dados para o componente pai
  const handleSave = () => {
    onSave({ primary, secondary });
    onClose();
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="space-y-4 p-4">
      {step === 1 && (
        <>
          <h3 className="mb-2 font-medium">Selecione a regional primária:</h3>
          <div className="grid grid-cols-3 gap-2">
            {regions.map((region) => (
              <Button
                key={region}
                variant={primary === region ? "default" : "outline"}
                size="sm"
                onClick={() => setPrimary(region)}
              >
                {region}
              </Button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button size="sm" disabled={!primary} onClick={() => setStep(2)}>
              Avançar
            </Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className="mb-2 font-medium">Selecione a regional secundária:</h3>
          <div className="grid grid-cols-3 gap-2">
            {regions
              .filter((r) => r !== primary)
              .map((region) => (
                <Button
                  key={region}
                  variant={secondary === region ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSecondary(region)}
                >
                  {region}
                </Button>
              ))}
          </div>
          <div className="flex justify-between">
            <Button variant="secondary" size="sm" onClick={handleBack}>
              Voltar
            </Button>
            <Button size="sm" onClick={handleSave}>
              Confirmar
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default RegionalSelector;
