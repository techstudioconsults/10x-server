const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({ path: './config/.env'});

//Load models
const User = require('./models/User');
const Course = require('./models/Resource');



// Connect DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON file
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));



// Import into DB
const importData = async() => {
    try {
        await User.create(users);
        await Course.create(courses);
        console.log('Data Imported...'.green.inverse);
        process.exit();
    } catch(err){
       console.error(err);
    }
} 


const deleteData = async() => {
    try {
        await User.deleteMany();
        await Course.deleteMany();
        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    } catch(err){
       console.error(err);
    }
} 

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}