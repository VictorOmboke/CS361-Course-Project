// Express error handling middleware
const errorHandler = (err, req, res, next) => {
  // Default to 500 if status code isn't specified
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  console.error("Error caught by global handler:", err);

  res.status(statusCode).json({
    status: status,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
