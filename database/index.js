const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/teste');
mongoose.Promise = global.Promise;

module.exports = mongoose;