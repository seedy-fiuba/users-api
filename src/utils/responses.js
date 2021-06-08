exports.notFoundResponse = function (res, msg) {
	const data = {
		status: 404,
		message: msg,
	};
	return res.status(404).json(data);
};

exports.unauthorizedResponse = function (res, msg) {
	const data = {
		status: 401,
		message: msg,
	};
	return res.status(401).json(data);
};

exports.unexpectedError = function (res, msg) {
	const data = {
		status: 500,
		message: msg,
	};
	return res.status(500).json(data);
};

exports.notImplementedError = function (res) {
	const data = {
		status: 501,
		message: 'Not implemented'
	}
	return res.status(501).json(data);
}

exports.createdOk = function (res, data) {
	return res.status(201).json(data);
};

exports.statusOk = function (res, data) {
	return res.status(200).json(data);
};

exports.badRequest = function (res, msg) {
	const data = {
		status: 400,
		message: msg,
	};
	return res.status(400).json(data);
};

exports.conflictError = function (res, msg) {
	const data = {
		status: 409,
		message: msg
	};
	return res.status(409).json(data);
};
