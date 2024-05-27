
/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 *
 */

const mongoose = require('mongoose');

const connectDB = async () => {
 const conn = await mongoose.connect(process.env.MONGO_URI)

 console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);

}

module.exports = connectDB;