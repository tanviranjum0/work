const express = require("express");
const { db } = require("./utils/db");
const authRoute = require("./routes/authRoute");
const ticketRoute = require("./routes/ticketRoute");
const { sendEmail } = require("./utils/sendEmail");
const { sendEmailOwner } = require("./utils/sendEmailOwner");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "https://rockbangla.vercel.app",
  })
);
app.use(express.urlencoded({ extended: false }));
dotenv.config();
db(process.env.MONGO);

app.post("/send/mail", async (req, res, next) => {
  // console.log(req.body);
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(
      res.status(400).json({
        success: false,
        message: "Please provide all details",
      })
    );
  }
  try {
    await sendEmail({
      subject: "Thanks for reaching me out",
      message,
      userEmail: email,
    });
    await sendEmailOwner({
      email: "tanviranjum010@gmail.com",
      subject: "Neww Visitor sent email",
      message,
      userEmail: email,
    });
    res.status(200).json({
      success: true,
      message: "Message Sent Successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
// Routes
app.use("/api/users", authRoute);
app.use("/api/tickets", ticketRoute);
app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT}`);
});
