var mongoose = require('mongoose');

var Schema = mongoose.Schema;

<<<<<<< HEAD
const UserSchema = new Schema({
    name: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    role: { type: String, required: true}
}, { timestamps: true }) // timestamps adds "createdAt" and "updatedAt" fields

module.exports = mongoose.model("User", UserSchema);
=======
var UserSchema = new Schema({
	name: { type: String, required: true},
	lastName: { type: String, required: true}
}, { timestamps: true }); // timestamps adds "createdAt" and "updatedAt" fields

module.exports = mongoose.model('User', UserSchema);
>>>>>>> f4da66ee6db57f1ab286cad87c631261acaccbec
