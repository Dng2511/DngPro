const mongoose = require('mongoose');


module.exports = () => {
    mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected!'));
    return mongoose;
}
