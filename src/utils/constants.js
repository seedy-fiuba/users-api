const allowedRole = [
  "sponsor",
  "entrepreneur",
  "reviewer"
]

const errorCodes = {
  UNEXPECTED_ERROR: 'UnexpectedError',
  UNAUTHORIZED_ERROR: 'UnauthorizedError',
  CONFLICT_ERROR: 'ConflictError',
  BAD_REQUEST: 'BadRequestError',
  NOT_FOUND: 'NotFoundError'
}

module.exports = {
  allowedRole: allowedRole,
  error: errorCodes
};