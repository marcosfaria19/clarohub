import f0 from "modules/clarospark/assets/f0.png";
import f0w from "modules/clarospark/assets/f0w.png";
import f1 from "modules/clarospark/assets/f1.png";
import f2 from "modules/clarospark/assets/f2.png";
import f3 from "modules/clarospark/assets/f3.png";

const iconMap = [
  { threshold: 0, iconDark: f0, iconLight: f0w },
  { threshold: 1, icon: f1 },
  { threshold: 15, icon: f2 },
  { threshold: 22, icon: f3 },
];

export function getLikeIcon(likes, theme) {
  for (let i = iconMap.length - 1; i >= 0; i--) {
    if (likes >= iconMap[i].threshold) {
      // Retorna o ícone correto com base no tema
      if (iconMap[i].iconDark && iconMap[i].iconLight) {
        return theme === "dark" ? iconMap[i].iconDark : iconMap[i].iconLight;
      }
      return iconMap[i].icon;
    }
  }
  return iconMap[0].icon;
}
