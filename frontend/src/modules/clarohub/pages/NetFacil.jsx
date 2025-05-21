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

export default function NetFacil({ userName, gestor }) {
  const dataHook = useNetFacil({ userName, gestor });

  const {
    currentStep,
    textoPadraoConcatenado,
    item,
    tabelaConsulta,
    showSGDTable,
    handleReset,
    fecharTabelaConsulta,
  } = dataHook;

  return (
    <Container className="select-none">
      <div className="relative mb-11 text-center">
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/30 blur-3xl"></div>
        <img
          src={appHeaderInfo["/netfacil"].icon}
          alt="Net  Fácil Icon"
          className="mx-auto mb-6 h-20 w-20 text-primary"
        />
        <h1 className="relative text-4xl font-bold tracking-tight text-foreground">
          Net Fácil
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Gerador de texto padrão para o NetSMS
        </p>
      </div>

      <Card className="relative mx-auto mb-12 max-w-full overflow-hidden border-primary/20 bg-background/50 shadow-2xl backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-card/15"></div>

        <CardContent className="relative p-8">
          <div className="grid gap-8 md:grid-cols-3">
            <StepInserirCodigo {...dataHook} />
            <StepPreencherDados {...dataHook} />
            <StepResultado {...dataHook} />
          </div>

          <Stepper currentStep={currentStep} />

          {currentStep === 2 && textoPadraoConcatenado && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded border px-4 py-2 text-sm hover:bg-muted"
              >
                Reiniciar
              </button>
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
              onRequestClose={() => dataHook.setShowSGDTable(false)}
            />
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
