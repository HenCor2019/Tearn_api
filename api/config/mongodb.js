const mongoose = require('mongoose')
const { MONGO_URI_TEST, NODE_ENV, MONGO_URI } = process.env

const connectionString = NODE_ENV === 'test' ? MONGO_URI_TEST : MONGO_URI

const connect = async () => {
  try {
    await mongoose.connect(connectionString, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    console.log('Database connected')
  } catch (error) {
    console.error({ error })
  }
}

module.exports = { connect }
