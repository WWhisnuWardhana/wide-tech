const errorHandler = (error, req, res, next) => {
  let status = 500;
  let message = "Internal Server Error";
  console.log(error);

  if (
    error.name === "SequelizeValidationError" ||
    error.name === "ValidationErrorItem" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    status = 400;
    message = error.errors.map((err) => err.message)[0];
  }

  if (error.name === "ForeignKeyConstraintError") {
    status = 400;
    message = "Data does not meet Foreign Key Requirements";
  }
  if (error.name === "SequelizeDatabaseError") {
    status = 400;
    message = "Invalid Input Syntax!";
  }

  if (error.name === "ReqUser") {
    status = 400;
    message = "Username is required!";
  }
  if (error.name === "ReqPass") {
    status = 400;
    message = "Password is required!";
  }

  if (error.name === "InvalidLogin") {
    status = 401;
    message = "Invalid Username or Password";
  }

  if (error.name === "Unauthorized") {
    status = 401;
    message = "Authentication Error, please login first!";
  }

  if (error.name === "JsonWebTokenError") {
    status = 401;
    message = "Authentication Error, invalid token";
  }

  if (error.name === "Forbidden") {
    status = 403;
    message = "You don't have access";
  }

  if (error.name === "UserNotFound") {
    status = 404;
    message = `Username not found`;
  }

  if (error.name === "ProductExist") {
    status = 400;
    message = `Product already exists!`;
  }

  if (error.name === "NotFound") {
    status = 404;
    message = `Data not found`;
  }

  if (error.name === "InvalidInput") {
    status = 400;
    message = `Inputs are invalid!`;
  }

  res.status(status).json({ message });
};

module.exports = errorHandler;
