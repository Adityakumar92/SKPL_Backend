const mongoose = require('mongoose');

const mongoDB_URL=process.env.MONGODB_URL;

const connectMongoDB = async()=>{
    try {
        await mongoose.connect(mongoDB_URL);
        console.log('Database connection sucessfully :)');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

connectMongoDB();