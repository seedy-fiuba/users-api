const axios = require('axios');
const constants = require('../utils/constants');

const createWallet = async() => {
	let config = {
		method: 'post',
		url: 'https://seedy-fiuba-smart-contract.herokuapp.com/wallet',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	return axios(config).then((response) => {
		return response.data;
	})
		.catch((error) => {
			if (error.response.status === 401) {
				return {
					message: constants.error.UNAUTHORIZED_ERROR
				};
			}

			return  {
				message: error.response.status,
				error: error.response.data
			};
		});
};

module.exports = {createWallet};