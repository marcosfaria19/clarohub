import { Toaster as Sonner } from "sonner";
import { useEffect, useState } from "react";

const Toaster = ({ ...props }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Função para atualizar o tema com base no localStorage
    const updateTheme = () => {
      const storedTheme = localStorage.getItem("theme") || "light";
      setTheme(storedTheme);
      console.log(storedTheme);
    };

    // Atualiza o tema ao montar o componente
    updateTheme();

    // Adiciona um listener para mudanças no localStorage
    window.addEventListener("storage", updateTheme);

    // Limpa o listener quando o componente for desmontado
    return () => {
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      /* toastOptions={...} */
      {...props}
    />
  );
};

export { Toaster };
