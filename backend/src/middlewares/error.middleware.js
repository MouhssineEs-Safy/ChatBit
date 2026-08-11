import { HttpError } from "../utils/httpError.js";

export function errorMiddleware(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: { message: err.message, code: err.code },
    });
  }
  console.error("❌ Unhandled error:", err);
  return res.status(500).json({
    error: { message: "Internal server error", code: "INTERNAL_ERROR" },
  });
}
