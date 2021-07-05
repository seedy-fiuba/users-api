const axios = require('axios');
const constants = require('../utils/constants');

const createWallet = async() => {
	let config = {
		method: 'post',
		url: 'http://localhost:3000/wallet', //ToDo: cambiar url a heroku
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