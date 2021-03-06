var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// update schema
userSchema = new Schema({

        unique_id: Number,
        email: String,
        username: String,
        fullName: String,
        phoneNumber: String,
        address: String,
        password: String,
        passwordConf: String
    }),
    User = mongoose.model('User', userSchema);

module.exports = User;