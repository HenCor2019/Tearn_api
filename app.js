var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const database = require("./mongodb/mongodb");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/User/User.router");
var categoryRouter = require("./routes/Category/Category.router");
var subjectRouter = require("./routes/Subject/Subject.router");
var courseRouter = require("./routes/Course/Course.router");
var homeRouter = require("./routes/Home/Home.router");
var searchRouter = require("./routes/Search/Search.router");
const notFound = require("./middlewares/NotFound.middleware");
const handleErrors = require("./middlewares/handleError.middleware");

database.connect();
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subject", subjectRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/home", homeRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/user", usersRouter);

app.use(notFound);
app.use(handleErrors);

module.exports = app;
