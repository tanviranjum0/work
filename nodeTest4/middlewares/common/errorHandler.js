const createError = require("http-errors");

//404 Not-Found Handler

function notFoundHandler(req, res, next) {
  next(createError(404, "Your requested content was not found"));
}

//Default error handler

function errorHandler(err, req, res, next) {
  res.render("error", {
    title: " error page",
  });
}
module.exports = { notFoundHandler, errorHandler };
