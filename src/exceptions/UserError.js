class UserError extends Error {
	constructor (name, message) {
		super(message);

		Object.setPrototypeOf(this, new.target.prototype);
		this.name = name;
		Error.captureStackTrace(this);
	}
}

module.exports = UserError;