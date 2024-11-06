export const noNotificationMessages = [
    "Tudo tranquilo por aqui. Hora de relaxar! 🌴",
    "Silêncio total nas notificações. Que tal um café? ☕",
    "Nada de novo? Ótimo momento para uma pausa! 🧘‍♂️",
    "Caixa de entrada vazia, mente tranquila. 🧠✨",
    "Sem novidades? Aproveite o momento de paz! 🕊️",
    "Notificações em férias. Que tal você também? 🏖️",
    "Tudo calmo como um lago em dia sem vento. 🌊",
    "Nenhuma notificação à vista. Horizonte limpo! 🔭",
    "Silêncio digital. Música para os ouvidos! 🎵",
    "Zero notificações. Infinitas possibilidades! 🚀",
    "Notificações tiraram uma soneca. Shh... 😴",
    "Caixa de entrada tão vazia quanto pote de biscoitos na segunda-feira. 🍪",
    "Nada novo? Hora de criar suas próprias aventuras! 🗺️",
    "Sem notificações. Seu tempo é todo seu! ⏳",
    "Sem notificações, ou seja, parabéns Yago! 🥳🎉",
    "Notificações em modo stealth. Ninja level: expert 🥷"
  ];
  
  export function getRandomNoNotificationMessage() {
    const randomIndex = Math.floor(Math.random() * noNotificationMessages.length);
    return noNotificationMessages[randomIndex];
  }