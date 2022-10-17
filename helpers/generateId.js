const generateId = () => {
  const numberRamdom = Math.random().toString(32).substring(2);
  const date = Date.now().toString(32);

  return numberRamdom + date;
};

export default generateId;
