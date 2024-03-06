const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');


// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Route files
const auth = require('./routes/auth');
const resources = require('./routes/resources');


//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(errorHandler);

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/resources', resources);



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));


// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1)); 
 });