// Função para formatar o nome (como você já tem)
export const formatUserName = (name) => {
  if (!name) return ""; // Retorna vazio se não existir nome

  const namesArray = name.split(" ");
  const firstName =
    namesArray[0].charAt(0).toUpperCase() +
    namesArray[0].slice(1).toLowerCase();
  const lastName =
    namesArray[namesArray.length - 1].charAt(0).toUpperCase() +
    namesArray[namesArray.length - 1].slice(1).toLowerCase();

  // Verifica se a soma do comprimento do primeiro e último nome é maior que 15
  if (firstName.length + lastName.length > 13) {
    const lastNameInitial = lastName.charAt(0) + "."; // Inicial do último nome
    return `${firstName} ${lastNameInitial}`; // Retorna primeiro nome + inicial do último nome
  } else {
    return `${firstName} ${lastName}`; // Retorna primeiro nome + último nome
  }
};

// Função para capitalizar a primeira letra de todas as palavras
export const capitalizeFirstLetters = (name) => {
  if (!name) return ""; // Retorna vazio se o nome for inválido

  const exceptions = ["da", "de", "do", "das", "dos", "e"];

  return name
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (exceptions.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};
