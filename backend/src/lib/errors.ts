export class NotFoundError extends Error {
  status = 404;
}

export class UnauthorizedError extends Error {
  status = 401;
}

export class BadRequestError extends Error {
  status = 400;
}