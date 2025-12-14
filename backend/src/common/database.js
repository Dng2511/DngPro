const mongoose = require('mongoose');



module.exports = () => {
    mongoose.connect(process.env.DB_URI, {
        authSource: 'admin',
        retryWrites: true,
        w: 'majority'
    })
        .then(() => console.log('MongoDB connected successfully'))
        .catch(err => {
            console.error('MongoDB connection error:', err.message);
            setTimeout(() => process.exit(1), 3000);
        });
    return mongoose;
}
