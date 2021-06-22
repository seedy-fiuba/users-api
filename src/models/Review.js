const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
        reviewerId: { type: Number, required: true},
        projectId: { type: Number, required: true}
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
    ReviewSchema.plugin(autoIncrement.plugin, 'Review');
    ReviewSchema.plugin(mongoosePaginate);
}

module.exports = mongoose.model('Review', ReviewSchema);