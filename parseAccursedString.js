const parseAccursedString = inputString => {
  const [matchedString] = inputString.match(/\((.*?)\)/g);
  const splitString = matchedString.split("of");
  const [, maxPageString] = splitString;
  const parsedString = maxPageString.trim().replace(")", "");
  const maxPageNumber = parseInt(parsedString, 10);
  return maxPageNumber;
};

module.exports = parseAccursedString;
