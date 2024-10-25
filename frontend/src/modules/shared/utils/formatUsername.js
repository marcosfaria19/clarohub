const formatUserName = (name) => {
  const namesArray = name.split(" ");
  return [
    namesArray[0].charAt(0).toUpperCase() +
      namesArray[0].slice(1).toLowerCase(),
    namesArray[namesArray.length - 1].charAt(0).toUpperCase() +
      namesArray[namesArray.length - 1].slice(1).toLowerCase(),
  ].join(" ");
};

export default formatUserName;
