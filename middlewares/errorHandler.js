module.exports = (err, req, res, next) => {
  console.error(err.stack); // Log the error details for debugging

  // Determine the status code and error message
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Send the error response
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
