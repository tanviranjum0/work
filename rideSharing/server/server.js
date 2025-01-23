import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;
app.get("/", (req, res) => {
  res.send("Hello");
});
app.listen(PORT, () => console.log("listening on port 3000"));
