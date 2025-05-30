import React from "react";
import Container from "modules/shared/components/ui/container";
import { Card, CardContent } from "modules/shared/components/ui/card";
import TabelaNetFacil from "modules/clarohub/components/netfacil/TabelaNetFacil";
import TabelaFechamentoSGD from "../components/netfacil/TabelaFechamentoSGD";
import appHeaderInfo from "modules/shared/utils/appHeaderInfo";
import StepInserirCodigo from "../components/netfacil/StepInserirCodigo";
import StepPreencherDados from "../components/netfacil/StepPreencherDados";
import StepResultado from "../components/netfacil/StepResultado";
import Stepper from "../components/netfacil/Stepper";
import useNetFacil from "../hooks/useNetFacil";
import { Button } from "modules/shared/components/ui/button";
import { RefreshCwIcon } from "lucide-react";

export default function NetFacil() {
  const data = useNetFacil();

  const {
    currentStep,
    textoPadraoConcatenado,
    item,
    tabelaConsulta,
    showSGDTable,
    handleReset,
    fecharTabelaConsulta,
  } = data;

  return (
    <Container className="select-none">
      <div className="relative mb-8 flex items-center justify-start gap-4">
        {/* Fundo decorativo pulsante */}
        <div className="absolute left-0 top-1/2 h-32 w-32 -translate-y-1/2 animate-pulse rounded-full bg-primary/30 blur-3xl" />

        {/* Ícone */}
        <img
          src={appHeaderInfo["/netfacil"].icon}
          alt="Net Fácil Icon"
          className="relative z-10 h-16 w-16 text-primary"
        />

        {/* Título e subtítulo */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Net Fácil
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerador de texto padrão para o NetSMS
          </p>
        </div>
      </div>

      <Card className="relative mx-auto mb-12 max-w-full overflow-hidden border-primary/20 bg-background/50 shadow-2xl backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-card/15"></div>

        <CardContent className="relative p-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: 0,
                title: "Inserir Código",
                Component: StepInserirCodigo,
              },
              {
                step: 1,
                title: "Preencher Dados",
                Component: StepPreencherDados,
              },
              {
                step: 2,
                title: "Resultado",
                Component: StepResultado,
              },
            ].map(({ step, Component }) => (
              <div
                key={step}
                className={`flex flex-1 transform flex-col transition-all duration-500 ${
                  currentStep === step ? "z-50 opacity-100" : "opacity-50"
                } ${currentStep === 2 && step !== 2 ? "pointer-events-none" : ""}`}
              >
                <div className="relative flex h-full flex-col rounded-xl border-2 border-primary/40 bg-card/70 p-6 backdrop-blur-sm">
                  <Component {...data} />
                </div>
              </div>
            ))}
          </div>

          <Stepper currentStep={currentStep} />

          {currentStep === 2 && textoPadraoConcatenado && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleReset}
                className="gap-2"
                variant="outline"
                size="lg"
              >
                <RefreshCwIcon className="h-5 w-5" />
                Iniciar Nova Geração
              </Button>
            </div>
          )}

          <TabelaNetFacil
            isOpen={tabelaConsulta}
            onRequestClose={fecharTabelaConsulta}
          />
          {item && (
            <TabelaFechamentoSGD
              item={item}
              isOpen={showSGDTable}
              onRequestClose={() => data.setShowSGDTable(false)}
            />
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
