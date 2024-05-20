const handle = (req, res) => {
  console.log(req.app.locals.title);
  res.send("This is GET 3000");
};
module.exports = handle;
