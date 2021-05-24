const randomCategories = require("./randomCategories");

const mapToRegex = (arr) =>
  arr.reduce(
    (acc, currentId, index) =>
      index != arr.length - 1 ? `${acc}${currentId}|` : `${acc}${currentId}`,
    ""
  );

const mapCategories = (categoriesId) => {
  const filteredCategories = randomCategories(categoriesId);

  return mapToRegex(filteredCategories);
};

module.exports = { mapCategories, mapToRegex };
