const express = require("express");
const { db } = require("./utils/db");
const authRoute = require("./routes/authRoute");
const ticketRoute = require("./routes/ticketRoute");
const { checkLogin } = require("./utils/checkLogin");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
dotenv.config();
db(process.env.MONGO);

app.get("/", (req, res) => {
  res.send("hola");
});
// Routes
app.use("/api/users", authRoute);
app.use("/api/tickets", ticketRoute);
app.listen(3000, () => console.log(`Server started on port 3000`));
