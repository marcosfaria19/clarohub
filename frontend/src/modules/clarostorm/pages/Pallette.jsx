import Container from "modules/shared/components/ui/container";
import { Card, CardContent } from "modules/shared/components/ui/card";
import { useState, useEffect } from "react";

const ColorCard = ({ name, variable }) => {
  const [color, setColor] = useState("");

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const variableValue = rootStyle.getPropertyValue(variable).trim();
    setColor(`hsl(${variableValue})`);
  }, [variable]);

  return (
    <Card className="overflow-hidden">
      <div className="h-16" style={{ backgroundColor: color }} />
      <CardContent className="p-4">
        <p className="text-sm font-medium">{name}</p>
      </CardContent>
    </Card>
  );
};

const ColorGroup = ({ title, colors }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {colors.map((color) => (
        <ColorCard key={color.variable} {...color} />
      ))}
    </div>
  </div>
);

const ClaroStormPalette = () => {
  const themeColors = [
    { name: "Background", variable: "--background" },
    { name: "Foreground", variable: "--foreground" },
    { name: "Card", variable: "--card" },
    { name: "Card Foreground", variable: "--card-foreground" },
    { name: "Popover", variable: "--popover" },
    { name: "Popover Foreground", variable: "--popover-foreground" },
    { name: "Primary", variable: "--primary" },
    { name: "Primary Foreground", variable: "--primary-foreground" },
    { name: "Secondary", variable: "--secondary" },
    { name: "Secondary Foreground", variable: "--secondary-foreground" },
    { name: "Muted", variable: "--muted" },
    { name: "Muted Foreground", variable: "--muted-foreground" },
    { name: "Accent", variable: "--accent" },
    { name: "Accent Foreground", variable: "--accent-foreground" },
    { name: "Destructive", variable: "--destructive" },
    { name: "Destructive Foreground", variable: "--destructive-foreground" },
    { name: "Success", variable: "--success" },
    { name: "Success Foreground", variable: "--success-foreground" },
    { name: "Warning", variable: "--warning" },
    { name: "Warning Foreground", variable: "--warning-foreground" },
    { name: "Border", variable: "--border" },
    { name: "Input", variable: "--input" },
    { name: "Ring", variable: "--ring" },
  ];

  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    document.documentElement.classList.toggle("light-theme");
  };

  return (
    <Container className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="mb-10 text-3xl font-bold">Claro Storm Color Palette</h1>
        <button
          onClick={toggleTheme}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Trocar tema
        </button>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            {theme === "dark" ? "Dark" : "Light"} Theme
          </h2>
          <ColorGroup title="Base Colors" colors={themeColors.slice(0, 6)} />
          <ColorGroup title="UI Colors" colors={themeColors.slice(6, 14)} />
          <ColorGroup title="Semantic Colors" colors={themeColors.slice(14)} />
        </div>
      </div>
    </Container>
  );
};

export default ClaroStormPalette;
