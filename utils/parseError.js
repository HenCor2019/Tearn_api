module.exports = (error) => {
  const name = error?.details
    ? error.details[0].type.split(".")[1]
    : error.name;
  const message = error?.details ? error.details[0].message : error.message;
  return { name, message };
};
