const Wallet = require('../models/Wallet');
let WalletService = require('../services/WalletService');
const constants = require('../utils/constants');
const UserError = require('../exceptions/UserError');

const createWallet = async () => {
	let walletData = await WalletService.createWallet();

	const wallet = new Wallet({
		address: walletData.address,
		privateKey: walletData.privateKey
	});

	try {
		await wallet.save(); //save wallet in database
		return wallet;
	} catch (error) {
		throw new UserError(constants.error.UNEXPECTED_ERROR, 'Couldnt save wallet');
	}
};

module.exports = {
	createWallet
};