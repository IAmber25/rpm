const returnProperDate = (aDate) => {
  return `${aDate.getDate() >= 10 ? aDate.getDate() : `0${aDate.getDate()}`}-${
    aDate.getMonth() + 1 >= 10
      ? aDate.getMonth() + 1
      : `0${aDate.getMonth() + 1}`
  }-${aDate.getFullYear()}`;
};

export { returnProperDate };
