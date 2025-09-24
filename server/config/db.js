const mongoose = require('mongoose');


const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Conneted: ${conn.connection.host}`);
    } catch( err ) {
        console.log('Error while connecting to database:', err);
    }
}

module.exports = dbConnect;