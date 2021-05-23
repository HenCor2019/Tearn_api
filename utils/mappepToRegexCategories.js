const randomCategories = require("./randomCategories");

module.exports = (categoriesId) => {
  const filteredCategories = randomCategories(categoriesId);

  return filteredCategories.reduce(
    (acc, currentId, index) =>
      index != categoriesId.length - 1
        ? `${acc}${currentId}|`
        : `${acc}${currentId}`,
    ""
  );
};
