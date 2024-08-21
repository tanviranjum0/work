const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://roksanakhanamseo:yWS7BRR3cVpyg5Tx@mern-ticket.yzj9r6j.mongodb.net/?retryWrites=true&w=majority&appName=mern-ticket'
    )
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}

module.exports = connectDB
