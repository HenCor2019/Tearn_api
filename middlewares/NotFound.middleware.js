module.exports = (req, res, next) => {
  return res.status(400).json({ error: true, message: 'Page not found' })
}
