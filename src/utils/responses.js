exports.notFoundResponse = function (res, msg) {
	var data = {
		status: 404,
		message: msg,
	};
	return res.status(404).json(data);
};

exports.unauthorizedResponse = function (res, msg) {
	var data = {
		status: 401,
		message: msg,
	};
	return res.status(401).json(data);
};

exports.unexpectedError = function (res, msg) {
	var data = {
		status: 500,
		message: msg,
	};
	return res.status(500).json(data);
};

exports.createdOk = function (res, data) {
<<<<<<< HEAD
    return res.status(201).json(data);
};

exports.statusOk = function (res, data) {
    return res.status(200).json(data);
};

exports.badRequest = function (res, msg) {
    var data = {
        status: 400,
        message: msg,
    };
    return res.status(400).json(data);
};
=======
	return res.status(201).json(data);
};
>>>>>>> f4da66ee6db57f1ab286cad87c631261acaccbec
