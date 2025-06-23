import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SWRConfig } from "swr";
import Rotas from "./routes/Rotas";
import "./App.css";
import { Toaster } from "modules/shared/components/ui/sonner";
import { ThemeProvider } from "modules/shared/contexts/ThemeContext";
import Container from "modules/shared/components/ui/container";
import { swrConfig } from "services/swrConfig";

function App() {
  return (
    <Router>
      <SWRConfig value={swrConfig}>
        <ThemeProvider>
          <Suspense fallback={<Container className="h-screen" />}>
            <Rotas />
          </Suspense>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </SWRConfig>
    </Router>
  );
}

export default App;
