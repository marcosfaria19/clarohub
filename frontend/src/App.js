import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Rotas from "./routes/Rotas";
import "./App.css";
import { Toaster } from "modules/shared/components/ui/sonner";
import { ThemeProvider } from "modules/shared/contexts/ThemeContext";
import Container from "modules/shared/components/ui/container";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Suspense fallback={<Container className="h-screen"></Container>}>
          <Rotas />
        </Suspense>
        <Toaster position="bottom-right" richColors />
      </ThemeProvider>
    </Router>
  );
}

export default App;
