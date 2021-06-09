require("dotenv").config()
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const database = require("./config/mongodb")
const cors = require("cors")

const indexRouter = require("./routes/index")
const usersRouter = require("./routes/User/User.router")
const categoryRouter = require("./routes/Category/Category.router")
const subjectRouter = require("./routes/Subject/Subject.router")
const commentaryRouter = require("./routes/Commentary/Commentary.router")
const courseRouter = require("./routes/Course/Course.router")
const homeRouter = require("./routes/Home/Home.router")
const searchRouter = require("./routes/Search/Search.router")
const reportRouter = require("./routes/Report/Report.router")
const notFound = require("./middlewares/NotFound.middleware")
const handleErrors = require("./middlewares/handleError.middleware")

database.connect()
const app = express()
app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/api/v1/", indexRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/subject", subjectRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/home", homeRouter)
app.use("/api/v1/report", reportRouter)
app.use("/api/v1/commentary", commentaryRouter)
app.use("/api/v1/search", searchRouter)
app.use("/api/v1/user", usersRouter)

app.use(notFound)
app.use(handleErrors)

module.exports = app
