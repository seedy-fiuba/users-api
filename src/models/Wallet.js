const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
	address: { type: String, required: true},
	privateKey: {type: String, required: true}
});

module.exports = mongoose.model('Wallet', WalletSchema);