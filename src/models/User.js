var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true},
	lastName: { type: String, required: true}
}, { timestamps: true }); // timestamps adds "createdAt" and "updatedAt" fields

module.exports = mongoose.model('User', UserSchema);