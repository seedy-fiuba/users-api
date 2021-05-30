const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
		name: { type: String, required: true},
		lastName: { type: String, required: true},
		email: { type: String, required: true},
		password: { type: String, required: true},
		role: { type: String, required: true},
		description : {type: String, required: false}
	},
	{
		timestamps: true, // timestamps adds "createdAt" and "updatedAt" fields
		toJSON: {
			transform: function (doc, ret) {
				ret.id = ret._id;
				delete ret.__v;
				delete ret._id;
			}
		}
	});

if (process.env.NODE_ENV !== 'test') {
	autoIncrement.initialize(mongoose.connection);
	UserSchema.plugin(autoIncrement.plugin, 'User');
	UserSchema.plugin(mongoosePaginate);
}

module.exports = mongoose.model('User', UserSchema);