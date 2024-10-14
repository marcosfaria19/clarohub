const formatUserName = (name) => {
  const namesArray = name.split(" ").slice(0, 2);
  return namesArray
    .map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
    .join(" ");
};

export default formatUserName;
