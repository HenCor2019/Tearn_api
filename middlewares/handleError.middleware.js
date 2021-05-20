const ERROR_HANDLERS = {
  CastError: (res) =>
    res
      .status(400)
      .json({ error: true, message: "id used is malformed" })
      .end(),

  required: (res, { message }) =>
    res.status(400).json({ error: true, message }).end(),

  base: (res, { message }) =>
    res.status(400).json({ error: true, message }).end(),

  existError: (res, { message }) =>
    res.status(400).json({ error: true, message }).end(),

  updateError: (res, { message }) =>
    res.status(400).json({ error: true, message }).end(),

  deleteError: (res, { message }) =>
    res.status(400).json({ error: true, message }).end(),

  defaultError: (res, error) => {
    console.error(error.name);
    res.status(500).json({ error: true, message: "Something was wrong" }).end();
  },
};

module.exports = (error, request, response) => {
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError;

  handler(response, error);
};
