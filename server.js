const express = require("express");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const session = require("express-session");

// Load env vars
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env" });

// Connect to database
connectDB();

const app = express();

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.set("trust proxy", true);

// Route files
const auth = require("./routes/auth");
const users = require("./routes/users");
const courses = require("./routes/resource");
const paystack = require("./routes/payment");
const subscribe = require("./routes/subscribe");



//Body parser
app.use(express.json());

//cors setup
app.use(cors());

// file upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(errorHandler);

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/course", courses);
app.use("/api/v1/payment", paystack);
app.use("/api/v1/subscribe", subscribe);



const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
