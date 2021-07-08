const ERROR_HANDLERS = {
  CastError: (res) =>
    res
      .status(400)
      .json({ error: true, message: 'id used is malformed' })
      .end(),
  NotFoundError: (res, { message }) =>
    res.status(404).json({ error: true, message }).end(),

  ExistError: (res, { message }) =>
    res.status(400).json({ error: true, message }).end(),

  UpdateError: (res, { message }) =>
    res.status(400).json({ error: true, message }).end(),

  InvalidTutorError: (res, { message }) =>
    res.status(400).json({ error: true, message }).end(),

  deleteError: (res, { message }) =>
    res.status(400).json({ error: true, message }).end(),

  ValidationError: (res, { message }) =>
    res.status(400).json({ error: true, message }).end(),

  InvalidDataError: (res, { message }) =>
    res.status(400).json({ error: true, message }).end(),
  defaultError: (res, error) => {
    console.error(error.name)
    return res
      .status(500)
      .json({ error: true, message: 'Something was wrong' })
      .end()
  }
}

module.exports = (error, request, response, next) => {
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler(response, error)
}
