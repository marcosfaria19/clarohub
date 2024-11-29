import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";
import { useTheme } from "modules/shared/contexts/ThemeContext";

const Tour = ({ onFinish }) => {
  const { theme } = useTheme();
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const isFirstLogin = localStorage.getItem("isFirstLoginSpark");

    if (!isFirstLogin) {
      setRunTour(true);
      localStorage.setItem("isFirstLoginSpark", "false");
    }
  }, []);

  const steps = [
    {
      target: "body",
      content:
        "Bem-vindo ao Claro Spark! Que tal fazer um tour rápido e conhecer as funcionalidades?",
      placement: "center",
    },
    {
      target: ".tour-sparkboard",
      content:
        "Este é o quadro de ideias, organizado por setores. Aqui, você pode visualizar e apoiar as ideias dos seus colegas.",
      placement: "bottom",
    },
    {
      target: ".tour-sparkmenu",
      content:
        "No menu, você consegue ver quantos Sparks (apoios) você tem para apoiar ideias no dia, acompanhar sua posição no ranking e filtrar as ideias por status.",
      placement: "bottom",
    },
    {
      target: ".tour-sparkadd",
      content:
        "Quer adicionar uma nova ideia? É só clicar aqui e compartilhar com a equipe.",
      placement: "left",
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (["finished", "skipped"].includes(status || "")) {
      onFinish();
      setRunTour(false); // Finaliza o tour
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous={true}
      showSkipButton={false}
      showProgress={false}
      styles={{
        options: {
          arrowColor: "#6d28d9",
          backgroundColor: theme === "light" ? "#fafafa" : "#212c3b",
          textColor: theme === "light" ? "#000000" : "#fafafa",
          primaryColor: "#6d28d9",
        },
        buttonBack: {
          color: theme === "light" ? "#000000" : "#fafafa",
        },
      }}
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Finalizar",
        next: "Próximo",
        skip: "Pular",
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default Tour;
