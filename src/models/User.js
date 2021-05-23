var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: { type: String, required: true},
	lastName: { type: String, required: true},
	email: { type: String, required: true},
	password: { type: String, required: true},
	role: { type: String, required: true}
}, { timestamps: true }); // timestamps adds "createdAt" and "updatedAt" fields

autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, 'User');

module.exports = mongoose.model('User', UserSchema);