import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Rotas from "./routes/Rotas";
import "./App.css";
import { Toaster } from "modules/shared/components/ui/sonner";
import { ThemeProvider } from "modules/shared/contexts/ThemeContext";
import Container from "modules/shared/components/ui/container";
import { CacheProvider } from "modules/shared/contexts/CacheContext";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CacheProvider enableLogs={true}>
          <Suspense fallback={<Container className="h-screen" />}>
            <Rotas />
          </Suspense>
          <Toaster position="bottom-right" richColors />
        </CacheProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
